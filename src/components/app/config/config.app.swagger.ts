import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const configAppSwagger = new DocumentBuilder()
  .setTitle('CRUD API through nestjs for chat app')
  .setDescription('chat app API description')
  .setVersion('1.0')
  .addTag('timkor')
  .addBearerAuth()
  .build();
