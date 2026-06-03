import { Module } from '@nestjs/common';
import { PulseController } from './pulse.controller';
import { AiModule } from 'src/ai/ai.module';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [AiModule, FirebaseModule],
  controllers: [PulseController]
})
export class PulseModule {}
