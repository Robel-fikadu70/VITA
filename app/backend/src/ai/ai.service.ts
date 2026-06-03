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
    this.genAI = new GoogleGenerativeAI(this.config.get('GEMINI_API_KEY'));
  }

  async generateWellnessReport(userId: string, allData: any) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
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
      const aiResponse = JSON.parse(
        result.response.text().replace(/```json|```/g, ''),
      );

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
}
