import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { FirebaseService } from '../firebase/firebase.service';

@Controller('wellness')
export class PulseController {
  constructor(
    private ai: AiService,
    private firebase: FirebaseService,
  ) {}

  // 1. Initial Onboarding (Step 2 & 4)
  @Post('onboarding')
  async setupProfile(@Body() body: { userId: string; profile: any }) {
    const db = this.firebase.getFirestore();
    // Save profile
    await db.collection('users').doc(body.userId).set(body.profile);
    // Generate Initial Analysis immediately (Step 4)
    return await this.ai.generateWellnessReport(body.userId, body.profile);
  }

  // 2. Daily Pulse & Sensor Sync (Step 6, 7, 8)
  @Post('sync')
  async dailySync(@Body() body: { userId: string; pulse: any; sensors: any }) {
    const db = this.firebase.getFirestore();
    // Get profile for context
    const userDoc = await db.collection('users').doc(body.userId).get();
    const fullData = { profile: userDoc.data(), ...body };

    // Update the Dashboard with a new Daily AI Analysis (Step 8)
    return await this.ai.generateWellnessReport(body.userId, fullData);
  }

  // 3. Get Dashboard (Step 5)
  @Get('dashboard/:userId')
  async getDashboard(@Param('userId') userId: string) {
    const db = this.firebase.getFirestore();
    const doc = await db.collection('wellness_reports').doc(userId).get();
    return doc.exists ? doc.data() : { message: 'Please complete onboarding.' };
  }
}
