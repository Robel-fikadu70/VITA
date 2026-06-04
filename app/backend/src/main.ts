import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS to allow mobile and web requests
  app.enableCors();
  
  // Bind to '0.0.0.0' so external physical devices on the local Wi-Fi can connect
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
