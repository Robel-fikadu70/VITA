import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private config: ConfigService,
    private firebase: FirebaseService,
  ) {
    const key = this.config.get<string>('GEMINI_API_KEY');
    console.log('Gemini Key Detected:', key ? 'YES (Starts with ' + key.substring(0, 5) + ')' : 'NO');
    this.genAI = new GoogleGenerativeAI(this.config.get('GEMINI_API_KEY'));
  }

  async generateWellnessReport(userId: string, allData: any) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const db = this.firebase.getFirestore();

    const prompt = `
      Context: Wellness App "VITAL-ETHIO". 
      User Data: ${JSON.stringify(allData)}

      Analyze and return ONLY a JSON object:
      {
        "score": number (1-100),
        "concerns": ["Concern 1", "Concern 2"],
        "homeProtocols": ["Step 1", "Step 2"],
        "recommendedServiceCategory": "Yoga" (Pick: Yoga, Spa, Fitness, or Mental Health)
      }
    `;

    try {
      const result = await model.generateContent(prompt);
      const rawText = result.response.text();
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const aiResponse = JSON.parse(cleanJson);

      // MATCHING: Find a partner service for the category
      const serviceSnap = await db
        .collection('services')
        .where('category', '==', aiResponse.recommendedServiceCategory)
        .limit(1)
        .get();

      let bookingCTA = null;
      if (!serviceSnap.empty) {
        bookingCTA = {
          id: serviceSnap.docs[0].id,
          ...serviceSnap.docs[0].data(),
        };
      }

      const report = {
        userId,
        score: aiResponse.score,
        concerns: aiResponse.concerns,
        homeProtocols: aiResponse.homeProtocols,
        bookingCTA, // If not null, Frontend shows the "Book Now" button
        updatedAt: new Date().toISOString(),
      };

      // Save as the LATEST report for the dashboard
      await db.collection('wellness_reports').doc(userId).set(report);
      return report;
    } catch (e) {
      return { error: 'AI logic failed', details: e };
    }
  }

  async askWellnessQuestion(userId: string, message: string): Promise<{ response: string }> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const db = this.firebase.getFirestore();

    let contextStr = 'Context: Wellness App "VITAL-ETHIO".';
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      const reportDoc = await db.collection('wellness_reports').doc(userId).get();

      if (userDoc.exists) {
        contextStr += ` User Profile: ${JSON.stringify(userDoc.data())}.`;
      }
      if (reportDoc.exists) {
        contextStr += ` Latest Wellness Report: ${JSON.stringify(reportDoc.data())}.`;
      }
    } catch (e) {
      console.error('Error fetching user context for chat:', e);
    }

    const prompt = `
      ${contextStr}
      The user is asking: "${message}"
      Please provide a concise, friendly, and helpful wellness response.
      Keep it short (2-4 sentences) and highly relevant to their recovery and wellbeing. Do not diagnose diseases.
    `;

    try {
      const result = await model.generateContent(prompt);
      const rawText = result.response.text();
      return { response: rawText.trim() };
    } catch (e) {
      return { response: 'Sorry, I failed to process your request. Please try again later.' };
    }
  }
}
