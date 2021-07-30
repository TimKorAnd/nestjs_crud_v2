import { NestFactory } from '@nestjs/core';
import { AppModule } from './components/app/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/all.exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { configAppSwagger } from './config/config.app.swagger';

export let app: INestApplication;

async function bootstrap() {
  app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  const document = SwaggerModule.createDocument(app, configAppSwagger);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.SERVER_PORT || 3000);
}
bootstrap();
