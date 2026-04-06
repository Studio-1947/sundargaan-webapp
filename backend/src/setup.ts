import { INestApplication, ValidationPipe, RequestMethod } from '@nestjs/common';
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
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
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
