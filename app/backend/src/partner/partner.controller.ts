import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Controller()
export class PartnerController {
  constructor(private firebase: FirebaseService) {}

  // 1. Discovery (Step 11)
  @Get('providers')
  async getProviders() {
    const db = this.firebase.getFirestore();
    const snap = await db.collection('services').get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // 2. Booking Flow (Step 12)
  @Post('book')
  async createBooking(
    @Body()
    body: {
      userId: string;
      serviceId: string;
      partnerId: string;
      price: number;
    },
  ) {
    const db = this.firebase.getFirestore();
    const booking = {
      ...body,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      refCode: 'VITA-' + Math.random().toString(36).toUpperCase().slice(2, 7),
    };
    await db.collection('bookings').add(booking);
    return booking;
  }

  // 3. Partner Dashboard (Step 15)
  @Get('partner/stats/:partnerId')
  async getPartnerStats(@Param('partnerId') partnerId: string) {
    const db = this.firebase.getFirestore();
    const snap = await db
      .collection('bookings')
      .where('partnerId', '==', partnerId)
      .get();

    const bookings = snap.docs.map((d) => d.data());
    const revenue = bookings.reduce((sum, b) => sum + b.price, 0);

    return {
      referralsReceived: bookings.length, // Every booking is a referral in our MVP
      bookingsGenerated: bookings.length,
      revenueGenerated: revenue,
      conversions: '85%', // Mocked for hackathon
    };
  }
}
