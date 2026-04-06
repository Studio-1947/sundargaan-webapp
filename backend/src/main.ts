import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global app setup
  setupApp(app);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`\n🚀 Sundargaan API running at http://localhost:${port}/api/v1`);
  console.log(`📖 Swagger docs at  http://localhost:${port}/api/docs\n`);
}
bootstrap();
