import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { AiModule } from './ai/ai.module';
import { PulseModule } from './pulse/pulse.module';
import { PartnerModule } from './partner/partner.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }),FirebaseModule, AiModule, PulseModule, PartnerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
