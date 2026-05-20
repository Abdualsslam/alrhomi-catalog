import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ImagesModule } from './images/images.module';
import { AdminModule } from './admin/admin.module';
import { StorageModule } from './storage/storage.module';
import { QueueModule } from './queue/queue.module';
import { JobStatusModule } from './job-status/job-status.module';
import { HealthModule } from './health/health.module';
import { FoldersModule } from './folders/folders.module';
import { SitemapModule } from './sitemap/sitemap.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 30,
      },
    ]),
    ConfigModule,
    DatabaseModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    ImagesModule,
    AdminModule,
    StorageModule,
    QueueModule,
    JobStatusModule,
    HealthModule,
    FoldersModule,
    SitemapModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
