import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccount = require(path.resolve('./firebase-adminsdk.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function cleanup() {
  console.log('--- Cleaning up VITAL-ETHIO Data ---');

  const cleanIds = ['tulsi-yoga', 'serenity-spa', 'alpha-fitness', 'mindful-space', 'nourish-kitchen', 'luna-wellness'];
  // 1. Delete services that don't have human-readable IDs
  const servicesSnap = await db.collection('services').get();
  for (const doc of servicesSnap.docs) {
    if (!cleanIds.includes(doc.id)) {
      console.log(`- Deleting duplicate service with random ID: ${doc.id} (${doc.data().name})`);
      await doc.ref.delete();
    }
  }

  // 2. Fix legacy bookings/reports that used full email as userId
  // (We'll just map them to the prefix version if we find them)
  const reportsSnap = await db.collection('wellness_reports').get();
  for (const doc of reportsSnap.docs) {
      const data = doc.data();
      if (data.userId && data.userId.includes('@')) {
          const newUserId = data.userId.split('@')[0].toLowerCase();
          console.log(`- Migrating report for ${data.userId} -> ${newUserId}`);
          await doc.ref.update({ userId: newUserId });
      }
      
      // Also fix bookingCTA.id if it points to a random ID (this is hard without mapping)
      // But since we deleted the random services, newly generated reports will use the clean IDs.
  }

  const bookingsSnap = await db.collection('bookings').get();
  for (const doc of bookingsSnap.docs) {
      const data = doc.data();
      if (data.userId && data.userId.includes('@')) {
          const newUserId = data.userId.split('@')[0].toLowerCase();
          console.log(`- Migrating booking for ${data.userId} -> ${newUserId}`);
          await doc.ref.update({ userId: newUserId });
      }
  }

  console.log('--- Cleanup Completed ---');
}

cleanup().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
