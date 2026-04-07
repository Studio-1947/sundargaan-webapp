import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../backend/src/app.module';
import { setupApp } from '../backend/src/setup';

let cachedApp: any;

export default async (req: any, res: any) => {
  if (!cachedApp) {
    cachedApp = await NestFactory.create(AppModule);
    // Apply shared setup (prefix, cors, pipes, swagger)
    setupApp(cachedApp);
    await cachedApp.init();
  }
  
  const instance = cachedApp.getHttpAdapter().getInstance();
  instance(req, res);
};
