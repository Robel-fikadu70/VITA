import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { TestController } from './test/test.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [AppController, TestController],
  providers: [AppService],
})
export class AppModule {}
