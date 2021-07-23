import { NestFactory } from '@nestjs/core';
import { AppModule } from './components/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/all.exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from './configure/config.swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.SERVER_PORT || 3000);
}
bootstrap();
