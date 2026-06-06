import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccount = require(path.resolve('./firebase-adminsdk.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function debug() {
  console.log('--- Services ---');
  const servicesSnap = await db.collection('services').get();
  servicesSnap.forEach(doc => console.log(`Service ID: ${doc.id}, Name: ${doc.data().name}, Category: ${doc.data().category}`));

  console.log('\n--- Wellness Reports ---');
  const reportsSnap = await db.collection('wellness_reports').get();
  if (reportsSnap.empty) {
    console.log('No wellness reports found!');
  } else {
    reportsSnap.forEach(doc => {
        const data = doc.data();
        console.log(`Report ID: ${doc.id}, userId: ${data.userId}, bookingCTA: ${JSON.stringify(data.bookingCTA)}`);
    });
  }

  console.log('\n--- Bookings ---');
  const bookingsSnap = await db.collection('bookings').get();
  bookingsSnap.forEach(doc => console.log(`Booking ID: ${doc.id}, userId: ${doc.data().userId}, partnerId: ${doc.data().partnerId}`));
}

debug().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
