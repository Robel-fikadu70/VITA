import { Module } from '@nestjs/common';
import { PulseController } from './pulse.controller';

@Module({
  controllers: [PulseController]
})
export class PulseModule {}
