import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private db: admin.firestore.Firestore;

  onModuleInit() {
    let serviceAccount: admin.ServiceAccount;

    // 1. Check if we have Environment Variables (Render/Production)
    if (process.env.FIREBASE_PRIVATE_KEY) {
      serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The replace() is CRITICAL: it fixes newline formatting for the private key
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };
    } else {
      // 2. Fallback to local JSON file (Local Development)
      // Ensure firebase-adminsdk.json is in your .gitignore!
      serviceAccount = require(path.resolve('./firebase-adminsdk.json'));
    }

    // Prevent re-initialization if the module reloads
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    this.db = admin.firestore();
    console.log('Firebase Firestore Initialized');
  }

  getFirestore() {
    return this.db;
  }
}