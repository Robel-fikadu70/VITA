import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private db: admin.firestore.Firestore;

  // firebase.service.ts
onModuleInit() {
  let serviceAccount: admin.ServiceAccount;

  if (process.env.FIREBASE_PRIVATE_KEY) {
    // 1. Get the key from env
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // 2. Remove surrounding quotes if they exist (common Render issue)
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.substring(1, privateKey.length - 1);
    }

    // 3. Fix the escaped newlines
    privateKey = privateKey.replace(/\\n/g, '\n');

    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    };
  } else {
    // Local development fallback
    serviceAccount = require(path.resolve('./firebase-adminsdk.json'));
  }

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  this.db = admin.firestore();
}

  getFirestore() {
    return this.db;
  }
}