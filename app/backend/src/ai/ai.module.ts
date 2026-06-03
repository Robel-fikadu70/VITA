import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
