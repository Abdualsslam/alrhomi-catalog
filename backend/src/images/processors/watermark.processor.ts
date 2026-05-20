import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as sharp from 'sharp';
import * as fs from 'graceful-fs';
import * as path from 'path';
import { pipeline, finished } from 'stream/promises';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { ImageDocument } from '../../database/schemas/image.schema';
import { JobStatusDocument } from '../../database/schemas/job-status.schema';
import { StorageService } from '../../storage/storage.service';
import { Readable } from 'stream';

@Processor('image-processing')
export class WatermarkProcessor {
  private readonly logger = new Logger(WatermarkProcessor.name);
  private s3Client: S3Client;
  private bucket: string;

  constructor(
    @InjectModel('Image')
    private imageModel: Model<ImageDocument>,
    @InjectModel('JobStatus')
    private jobStatusModel: Model<JobStatusDocument>,
    private configService: ConfigService,
    private storageService: StorageService,
  ) {
    this.logger.log('🚀 WatermarkProcessor initialized');

    const awsConfig = this.configService.get('aws');
    this.bucket = awsConfig.bucket;

    const logoPath = path.resolve(process.cwd(), 'assets', 'logo.png');
    const tmpDir = path.resolve(process.cwd(), 'tmp');

    this.logger.log(`📁 Logo path: ${logoPath}`);
    this.logger.log(`📁 Tmp directory: ${tmpDir}`);
    this.logger.log(`🪣 S3 Bucket: ${this.bucket}`);
    this.logger.log(`🌍 S3 Region: ${awsConfig.region}`);

    // Check if logo exists
    if (fs.existsSync(logoPath)) {
      this.logger.log('✅ Logo file found');
    } else {
      this.logger.warn(`⚠️ Logo file NOT found at: ${logoPath}`);
    }

    // Ensure tmp directory exists
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
      this.logger.log(`📁 Created tmp directory: ${tmpDir}`);
    }

    this.s3Client = new S3Client({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });

    this.logger.log('✅ WatermarkProcessor ready');
  }

  @Process()
  async handleWatermark(job: Job) {
    const {
      data: {
        metadata: { _id, s3Key },
      },
      id: jobId,
    } = job;

    this.logger.log(`🔄 Starting job ${jobId} for image ${_id}, S3 key: ${s3Key}`);

    const tmpDir = path.resolve(process.cwd(), 'tmp');
    fs.mkdirSync(tmpDir, { recursive: true });

    const ext = path.extname(s3Key);
    const origPath = path.join(tmpDir, `${_id}-orig${ext}`);
    const transparentP = path.join(tmpDir, `${_id}-trans.png`);
    const outPath = path.join(tmpDir, `${_id}-final.png`);
    const logoPath = path.resolve(process.cwd(), 'assets', 'logo.png');

    try {
      // Check if logo exists
      if (!fs.existsSync(logoPath)) {
        throw new Error(`Logo file not found at: ${logoPath}`);
      }
      // Update job status
      await this.jobStatusModel.findOneAndUpdate(
        { jobId: jobId.toString() },
        { status: 'processing', startedAt: new Date() },
        { upsert: true },
      );

      await this.imageModel.findByIdAndUpdate(_id, {
        status: 'processing',
        jobId: jobId.toString(),
        progress: 0,
      });

      this.logger.log(`📥 Downloading image from S3: ${s3Key}`);

      // Download image from S3
      const getObj = await this.s3Client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: s3Key }),
      );

      const ws = fs.createWriteStream(origPath);
      if (getObj.Body instanceof Readable) {
        await pipeline(getObj.Body, ws);
      } else if (getObj.Body) {
        await pipeline(Readable.from(getObj.Body as AsyncIterable<Uint8Array> | Buffer), ws);
      } else {
        throw new Error('S3 object body is empty');
      }
      await finished(ws);

      this.logger.log(`✅ Image downloaded, starting background removal`);

      // Remove background
      await this.removeBackgroundBySampling(origPath, transparentP, 50);

      this.logger.log(`✅ Background removed, starting logo composition`);

      // Composite logo
      await this.compositeLogoWithSmallBadge(transparentP, logoPath, logoPath, outPath);

      this.logger.log(`✅ Logo composed, uploading to S3`);

      // Upload watermarked image to S3
      const watermarkedKey = `watermarked/${_id}.png`;
      const fileStream = fs.createReadStream(outPath);
      await this.storageService.uploadFile(watermarkedKey, fileStream, 'image/png');

      const awsConfig = this.configService.get('aws');
      const watermarkedUrl = `https://${this.bucket}.s3.${awsConfig.region}.amazonaws.com/${watermarkedKey}`;

      // Update status
      await this.jobStatusModel.findOneAndUpdate(
        { jobId: jobId.toString() },
        { status: 'completed', progress: 100, finishedAt: new Date() },
      );

      await this.imageModel.findByIdAndUpdate(_id, {
        status: 'completed',
        isWatermarked: true,
        watermarkedUrl,
        progress: 100,
      });

      // Cleanup
      this.safeUnlink(origPath);
      this.safeUnlink(transparentP);
      this.safeUnlink(outPath);

      this.logger.log(`✅ Job ${jobId} completed. URL: ${watermarkedUrl}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const errorStack = err instanceof Error ? err.stack : undefined;

      this.logger.error(`❌ Job ${jobId} failed for image ${_id}: ${errorMessage}`, errorStack);

      await this.jobStatusModel.findOneAndUpdate(
        { jobId: jobId.toString() },
        { status: 'failed', finishedAt: new Date() },
      );
      await this.imageModel.findByIdAndUpdate(_id, { status: 'failed' });

      // Cleanup on error
      this.safeUnlink(origPath);
      this.safeUnlink(transparentP);
      this.safeUnlink(outPath);

      throw err;
    }
  }

  private async removeBackgroundBySampling(inputPath: string, outputPath: string, tolerance = 50) {
    const img = sharp(inputPath).ensureAlpha();
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;

    // تحسين أخذ العينة: أخذ عينة من الزوايا فقط (أكثر موثوقية للخلفية)
    const cornerSize = Math.min(Math.floor(width * 0.1), Math.floor(height * 0.1), 50);
    let sumR = 0,
      sumG = 0,
      sumB = 0,
      count = 0;

    const sample = (x: number, y: number) => {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        const idx = (y * width + x) * channels;
        sumR += data[idx];
        sumG += data[idx + 1];
        sumB += data[idx + 2];
        count++;
      }
    };

    // أخذ عينة من الزوايا فقط (أكثر دقة للخلفية)
    for (let x = 0; x < cornerSize; x++) {
      for (let y = 0; y < cornerSize; y++) {
        // الزاوية العلوية اليسرى
        sample(x, y);
        // الزاوية العلوية اليمنى
        sample(width - 1 - x, y);
        // الزاوية السفلية اليسرى
        sample(x, height - 1 - y);
        // الزاوية السفلية اليمنى
        sample(width - 1 - x, height - 1 - y);
      }
    }

    // إذا فشل أخذ العينة، احفظ الصورة كما هي بدون تعديل
    if (count === 0) {
      await img.png().toFile(outputPath);
      return;
    }

    const Rb = sumR / count;
    const Gb = sumG / count;
    const Bb = sumB / count;

    // تقليل tolerance وتحسين المنطق
    const toleranceSquared = tolerance * tolerance;

    for (let i = 0; i < data.length; i += channels) {
      const dr = data[i] - Rb;
      const dg = data[i + 1] - Gb;
      const db = data[i + 2] - Bb;
      const distSquared = dr * dr + dg * dg + db * db;

      // فقط إزالة البكسل إذا كان قريب جداً من لون الخلفية
      // وإضافة شرط: يجب أن يكون البكسل في الحواف أو قريب منها
      const pixelIndex = i / channels;
      const x = pixelIndex % width;
      const y = Math.floor(pixelIndex / width);
      const isNearEdge =
        x < cornerSize || x >= width - cornerSize || y < cornerSize || y >= height - cornerSize;

      if (distSquared <= toleranceSquared && isNearEdge) {
        data[i + 3] = 0; // شفافية
      }
    }

    await sharp(data, { raw: { width, height, channels } }).png().toFile(outputPath);
  }

  private async compositeLogoWithSmallBadge(
    productPath: string,
    logoPath: string,
    badgePath: string,
    outputPath: string,
  ) {
    const prod = sharp(productPath);
    const meta = await prod.metadata();

    const maxDim = Math.min(meta.width || 0, meta.height || 0);

    // Small badge (10% of smallest dimension)
    const badgeMeta = await sharp(badgePath).metadata();
    const badgeSize = Math.round(maxDim * 0.1);
    const badgeW =
      (badgeMeta.width || 0) >= (badgeMeta.height || 0)
        ? badgeSize
        : Math.round(badgeSize * ((badgeMeta.width || 0) / (badgeMeta.height || 0)));
    const badgeH =
      (badgeMeta.width || 0) >= (badgeMeta.height || 0)
        ? Math.round(badgeSize * ((badgeMeta.height || 0) / (badgeMeta.width || 0)))
        : badgeSize;
    const badgeBuf = await sharp(badgePath).resize(badgeW, badgeH).png().ensureAlpha().toBuffer();
    const badgeTop = (meta.height || 0) - badgeH - 10;
    const badgeLeft = Math.floor(((meta.width || 0) - badgeW) / 2);

    // الحصول على buffer المنتج مع الحفاظ على الألوان والشفافية
    const productBuf = await prod.png().ensureAlpha().toBuffer();

    // جعل الصورة المائية أصغر (40% من حجم الصورة الأصلي)
    const logoMeta = await sharp(logoPath).metadata();
    const watermarkSize = Math.round(maxDim * 0.4); // 40% من أصغر بعد
    const watermarkW =
      (logoMeta.width || 0) >= (logoMeta.height || 0)
        ? watermarkSize
        : Math.round(watermarkSize * ((logoMeta.width || 0) / (logoMeta.height || 0)));
    const watermarkH =
      (logoMeta.width || 0) >= (logoMeta.height || 0)
        ? Math.round(watermarkSize * ((logoMeta.height || 0) / (logoMeta.width || 0)))
        : watermarkSize;

    const watermarkBuf = await sharp(logoPath)
      .resize(watermarkW, watermarkH, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .ensureAlpha()
      .toBuffer();

    // وضع الصورة المائية في المنتصف
    const watermarkTop = Math.floor(((meta.height || 0) - watermarkH) / 2);
    const watermarkLeft = Math.floor(((meta.width || 0) - watermarkW) / 2);

    // استخدام 'over' blend mode مع ضمان الحفاظ على الألوان
    await sharp({
      create: {
        width: meta.width || 0,
        height: meta.height || 0,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        {
          input: watermarkBuf,
          top: watermarkTop,
          left: watermarkLeft,
          blend: 'over',
        },
        {
          input: productBuf,
          blend: 'over', // هذا يحافظ على الألوان الأصلية
        },
        {
          input: badgeBuf,
          top: badgeTop,
          left: badgeLeft,
          blend: 'over',
        },
      ])
      .png()
      .toFile(outputPath);
  }

  private safeUnlink(filePath: string, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        fs.rmSync(filePath, { force: true });
        return;
      } catch (error) {
        if (i === retries - 1) throw error;
      }
    }
  }
}
