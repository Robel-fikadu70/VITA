import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private db: admin.firestore.Firestore;

  onModuleInit() {
    let credential: admin.ServiceAccount;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
      );

      credential = {
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'),
      };
    } else {
      const localServiceAccount = require(
        path.resolve('./firebase-adminsdk.json'),
      );

      credential = {
        projectId: localServiceAccount.project_id,
        clientEmail: localServiceAccount.client_email,
        privateKey: localServiceAccount.private_key,
      };
    }

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(credential),
      });
    }

    this.db = admin.firestore();
  }

  getFirestore() {
    return this.db; 
  }
}