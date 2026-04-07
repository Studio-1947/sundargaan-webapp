import {
  INestApplication,
  ValidationPipe,
  RequestMethod,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

export function setupApp(app: INestApplication) {
  // Global prefix
  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Root status message
  app.getHttpAdapter().get('/', (req: any, res: any) => {
    res.send('Sundargaan Backend is running! 🚀');
  });

  // CORS
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://sundargaan-webapp.vercel.app',
    ...(process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(',').map((u) => u.trim())
      : []),
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger / OpenAPI docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sundargaan API')
    .setDescription('Backend API for the Sundargaan cultural heritage platform')
    .setVersion('1.0')
    .addTag('Artists', 'Artist profiles and sample works')
    .addTag('Archive', 'Cultural archive items')
    .addTag('Bookings', 'Artist booking requests')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-standalone-preset.js',
    ],
    swaggerOptions: { persistAuthorization: true },
  });
}
