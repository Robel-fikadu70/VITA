import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import * as admin from 'firebase-admin';

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

  // 4. Detailed Analytics for Dashboard
  @Get('partner/analytics/:partnerId')
  async getPartnerAnalytics(@Param('partnerId') partnerId: string) {
    const db = this.firebase.getFirestore();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Fetch Bookings
    const bookingsSnap = await db
      .collection('bookings')
      .where('partnerId', '==', partnerId)
      .get();
    const bookings = bookingsSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as any[];

    // 2. Fetch Referrals (Wellness Reports where this partner was recommended)
    const reportsSnap = await db.collection('wellness_reports').get();
    const referrals = reportsSnap.docs
      .map((d) => ({ id: d.id, ...d.data() } as any))
      .filter((r) => {
        const cta = r.bookingCTA || {};
        return (
          cta.id === partnerId || 
          cta.name?.toLowerCase().includes(partnerId.replace('-', ' '))
        );
      });

    // 3. Fetch User data for labels (joining)
    const uniqueUserIds = [
      ...new Set([
        ...referrals.map((r) => r.userId),
        ...bookings.map((b) => b.userId),
      ]),
    ].filter(Boolean);

    const usersData: Record<string, any> = {};
    if (uniqueUserIds.length > 0) {
      // Chunking for Firestore 'in' limit (30)
      const userIdChunks = [];
      for (let i = 0; i < uniqueUserIds.length; i += 30) {
        userIdChunks.push(uniqueUserIds.slice(i, i + 30));
      }

      for (const chunk of userIdChunks) {
        const usersSnap = await db
          .collection('users')
          .where(admin.firestore.FieldPath.documentId(), 'in', chunk)
          .get();
        usersSnap.forEach((doc) => {
          usersData[doc.id] = doc.data();
        });
      }
    }

    // 4. Summarize KPIs
    const revenue = bookings.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
    const referralsToday = referrals.filter(
      (r) => r.updatedAt && new Date(r.updatedAt) >= today,
    );

    // 5. Recent Activity Feed
    const activity = [
      ...referrals.map((r) => ({
        id: `ref-${r.id}`,
        type: 'referral',
        message: `${usersData[r.userId]?.name || 'New user'} was referred for ${r.bookingCTA?.name || 'service'}`,
        timestamp: r.updatedAt || new Date().toISOString(),
      })),
      ...bookings.map((b) => ({
        id: `book-${b.id}`,
        type: b.status === 'completed' ? 'visit' : 'booking',
        message: `${usersData[b.userId]?.name || 'Customer'} ${b.status === 'completed' ? 'completed' : 'booked'} ${b.serviceId || 'service'}`,
        timestamp: b.createdAt || new Date().toISOString(),
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 5);

    // 6. Recent Referrals List
    const recentReferrals = referrals
      .sort(
        (a, b) =>
          new Date(b.updatedAt || 0).getTime() -
          new Date(a.updatedAt || 0).getTime(),
      )
      .slice(0, 10)
      .map((r) => ({
        id: r.id,
        customerName: usersData[r.userId]?.name || 'Anonymous User',
        wellnessGoal: usersData[r.userId]?.primaryGoal || 'Wellness',
        recommendedService: r.bookingCTA?.name || 'Recovery Session',
        status: bookings.some((b) => b.userId === r.userId) ? 'Booked' : 'New',
        referralDate: r.updatedAt || new Date().toISOString(),
      }));

    return {
      kpis: {
        newReferralsToday: {
          value: referralsToday.length,
          change: 0,
          trend: 'up',
        },
        activeReferrals: { value: referrals.length, change: 0, trend: 'up' },
        conversionRate: {
          value:
            referrals.length > 0
              ? Number((bookings.length / referrals.length) * 100).toFixed(1)
              : 0,
          change: 0,
          trend: 'up',
        },
        revenueGenerated: { value: revenue, change: 0, trend: 'up' },
        completedVisits: {
          value: bookings.filter((b) => b.status === 'completed').length,
          change: 0,
          trend: 'up',
        },
        campaignReach: { value: referrals.length * 15, change: 0, trend: 'up' },
      },
      recentActivity: activity,
      recentReferrals: recentReferrals,
      // For charts, we'll provide some basic data derived from real ones or minimal mock trends
      weeklyReferrals: [
        { day: 'Mon', referrals: 4 },
        { day: 'Tue', referrals: 7 },
        { day: 'Wed', referrals: referrals.length },
        { day: 'Thu', referrals: referralsToday.length },
      ],
    };
  }

  // 5. Full Referrals List
  @Get('partner/referrals/:partnerId')
  async getPartnerReferrals(@Param('partnerId') partnerId: string) {
    const db = this.firebase.getFirestore();

    // 1. Fetch all wellness reports recommending this partner
    // We query by ID, but also fetch a bit more to ensure we don't miss anything due to schema variations
    const reportsSnap = await db.collection('wellness_reports').get();
    
    // Filter in memory for maximum resilience during demo
    const reports = reportsSnap.docs
      .map((d) => ({ id: d.id, ...d.data() } as any))
      .filter((r) => {
        const cta = r.bookingCTA || {};
        return (
          cta.id === partnerId || 
          cta.name?.toLowerCase().includes(partnerId.replace('-', ' '))
        );
      });

    // 2. Fetch associated bookings to check status
    const bookingsSnap = await db
      .collection('bookings')
      .where('partnerId', '==', partnerId)
      .get();
    const bookings = bookingsSnap.docs.map((d) => d.data()) as any[];

    // 3. Join with user data
    const userIds = [...new Set(reports.map((r) => r.userId))];
    const usersData: Record<string, any> = {};

    if (userIds.length > 0) {
      const usersSnap = await db
        .collection('users')
        .where(admin.firestore.FieldPath.documentId(), 'in', userIds.slice(0, 30))
        .get();
      usersSnap.forEach((doc) => {
        usersData[doc.id] = doc.data();
      });
    }

    // 4. Map to Referral interface
    return reports.map((r) => {
      const user = usersData[r.userId] || {};
      const userBooking = bookings.find((b) => b.userId === r.userId);

      // Determine status: explicitly stored status > booking status > New
      let status = r.status || 'New';
      if (!r.status && userBooking) {
        status = userBooking.status === 'completed' ? 'Visited' : 'Booked';
      }

      return {
        id: r.id,
        customerName: user.name || 'User ' + r.id.substring(0, 4),
        wellnessGoal: user.primaryGoal || 'Improve Health',
        recommendedService: r.bookingCTA?.name || 'Wellness Profile',
        serviceType: r.bookingCTA?.type || 'Consultation',
        wellnessCategory: r.bookingCTA?.category || 'Wellness',
        referralDate: r.updatedAt || new Date().toISOString(),
        status: status,
        referralSource: 'AI Wellness Analysis',
        contactInfo: {
          email: user.email || 'not-provided@vita.com',
          phone: user.phone || 'N/A',
        },
        notes: user.concerns?.join(', ') || 'Generated via mobile assessment',
        bookingDate: userBooking?.createdAt,
      };
    });
  }

  // 6. Update Referral Status
  @Post('partner/referrals/:id/status')
  async updateReferralStatus(
    @Param('id') userId: string,
    @Body() body: { status: string },
  ) {
    const db = this.firebase.getFirestore();
    // In our system, the referral ID is the userId (as they are documents in wellness_reports)
    await db.collection('wellness_reports').doc(userId).update({
      status: body.status,
      statusUpdatedAt: new Date().toISOString(),
    });
    return { success: true, status: body.status };
  }

  // 7. Full Notifications List (derived from activity)
  @Get('partner/notifications/:partnerId')
  async getPartnerNotifications(@Param('partnerId') partnerId: string) {
    const db = this.firebase.getFirestore();

    // 1. Fetch Bookings
    const bookingsSnap = await db
      .collection('bookings')
      .where('partnerId', '==', partnerId)
      .get();
    const bookings = bookingsSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as any[];

    // 2. Fetch Referrals (Wellness Reports where this partner was recommended)
    const reportsSnap = await db.collection('wellness_reports').get();
    const referrals = reportsSnap.docs
      .map((d) => ({ id: d.id, ...d.data() } as any))
      .filter((r) => {
        const cta = r.bookingCTA || {};
        return (
          cta.id === partnerId ||
          cta.name?.toLowerCase().includes(partnerId.replace('-', ' '))
        );
      });

    // 3. Fetch User data for labels
    const uniqueUserIds = [
      ...new Set([
        ...referrals.map((r) => r.userId),
        ...bookings.map((b) => b.userId),
      ]),
    ].filter(Boolean);

    const usersData: Record<string, any> = {};
    if (uniqueUserIds.length > 0) {
      const usersSnap = await db
        .collection('users')
        .where(
          admin.firestore.FieldPath.documentId(),
          'in',
          uniqueUserIds.slice(0, 30),
        )
        .get();
      usersSnap.forEach((doc) => {
        usersData[doc.id] = doc.data();
      });
    }

    // 4. Create Notifications from Activity
    const notifications = [
      ...referrals.map((r) => ({
        id: `ref-${r.id}`,
        type: 'new_referral',
        title: 'New Referral',
        message: `${usersData[r.userId]?.name || 'New user'} was referred for ${r.bookingCTA?.name || 'service'}`,
        timestamp: r.updatedAt || new Date().toISOString(),
        read: false,
        referralId: r.id,
      })),
      ...bookings.map((b) => ({
        id: `book-${b.id}`,
        type: b.status === 'completed' ? 'booking_complete' : 'booking_update',
        title: b.status === 'completed' ? 'Visit Completed' : 'New Booking',
        message: `${usersData[b.userId]?.name || 'Customer'} ${b.status === 'completed' ? 'completed' : 'booked'} ${b.serviceId || 'service'}`,
        timestamp: b.createdAt || new Date().toISOString(),
        read: false,
        bookingId: b.id,
      })),
    ].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    return notifications;
  }
}
