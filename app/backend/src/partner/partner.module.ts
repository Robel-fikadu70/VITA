import { Module } from '@nestjs/common';
import { PartnerController } from './partner.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [PartnerController]
})
export class PartnerModule {}
