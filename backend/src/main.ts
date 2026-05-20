import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT || process.env.APP_PORT || '5000', 10);
  const apiDomain = process.env.API_DOMAIN;

  // Use Helmet for security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
          connectSrc: ["'self'"],
        },
      },
    }),
  );

  app.use(cookieParser());
  app.use(compression());

  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
        : [process.env.FRONTEND_URL].filter((url): url is string => Boolean(url))
      : [true];

  // Enable CORS with better configuration
  app.enableCors({
    origin:
      allowedOrigins.length === 1 && allowedOrigins[0] === true
        ? true
        : (allowedOrigins as string[]),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400, // 24 hours
  });

  // إضافة middleware لتسجيل جميع الطلبات الواردة (حتى قبل authentication)
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const method = req.method;
    const url = req.url;
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const hasAuth = req.headers.authorization ? 'with-auth' : 'no-auth';

    console.log(`[${new Date().toISOString()}] ${method} ${url} from ${ip} ${hasAuth} - Incoming`);

    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(
        `[${new Date().toISOString()}] ${method} ${url} ${res.statusCode} - ${duration}ms - Completed`,
      );
    });

    next();
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger configuration
  const documentBuilder = new DocumentBuilder()
    .setTitle('Product Catalog API')
    .setDescription(
      'Official OpenAPI specification for Alrhomi Catalog. This documentation is generated from NestJS decorators and stays in sync with the codebase.',
    )
    .setVersion('1.0.0')
    .setContact('Alrhomi Engineering', '', 'engineering@alrhomi.local')
    .setLicense('Proprietary', '')
    .addServer(`http://localhost:${port}`, 'Local development');

  if (apiDomain) {
    documentBuilder.addServer(`https://${apiDomain}`, 'Production');
  }

  const config = documentBuilder
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'Authentication endpoints')
    .addTag('Products', 'Product management endpoints')
    .addTag('Images', 'Image management endpoints')
    .addTag('Categories - Admin', 'Category management endpoints (Admin only)')
    .addTag('Admin - Users', 'User management endpoints (Admin only)')
    .addTag('Admin - Images', 'Image management endpoints (Admin only)')
    .addTag('Admin - Statistics', 'Statistics endpoints (Admin only)')
    .addTag('Job Status', 'Job status endpoints')
    .addTag('Folders', 'Folder tree and image organization endpoints')
    .addTag('Health', 'Service liveness and readiness probes')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey}_${methodKey}`,
  });

  if (apiDomain) {
    document.servers = [
      { url: `http://localhost:${port}`, description: 'Local development' },
      { url: `https://${apiDomain}`, description: 'Production' },
    ];
  }

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Alrhomi Catalog API Docs',
  });

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📚 Swagger documentation available at http://localhost:${port}/api-docs`);
}

bootstrap();
