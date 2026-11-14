import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable global validation pipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that do not have any decorators in the DTO
      forbidNonWhitelisted: true, // throws an error if any non-whitelisted properties are present
      transform: true, // automatically transforms payloads to be objects typed according to their DTO classes
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
