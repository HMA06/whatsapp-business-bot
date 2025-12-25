import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // تفعيل CORS ضروري جداً للسماح للفرونت إند باستلام الـ QR من نفق ngrok
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // الباك إند يعمل على بورت 3001
  await app.listen(3001);
  console.log(`Server started on http://localhost:3001`);
}
bootstrap();