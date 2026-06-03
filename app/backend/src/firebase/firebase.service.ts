import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private db: admin.firestore.Firestore;

  onModuleInit() {
    // Load the JSON file you downloaded
    const serviceAccount = require(path.resolve('./firebase-adminsdk.json'));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    this.db = admin.firestore();
    console.log('Firebase Firestore Initialized');
  }

  getFirestore() {
    return this.db;
  }
}