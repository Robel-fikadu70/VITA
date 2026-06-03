import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { TestController } from './test/test.controller';
import { AiModule } from './ai/ai.module';
import { PulseModule } from './pulse/pulse.module';

@Module({
  imports: [FirebaseModule, AiModule, PulseModule],
  controllers: [AppController, TestController],
  providers: [AppService],
})
export class AppModule {}
