import wellnessData from '../data/wellnessInsights.json';

export interface DemandTrend {
  category: string;
  currentMonth: number;
  previousMonth: number;
  changePercentage: number;
  trend: 'up' | 'down';
}

export interface WellnessInsights {
  demandTrends: DemandTrend[];
  weeklyTrends: Array<{ week: string; Stress: number; Sleep: number; Recovery: number; Nutrition: number; Fitness: number }>;
  ageDistribution: Array<{ ageGroup: string; value: number }>;
  topServices: Array<{ service: string; requests: number }>;
  keyInsights: KeyInsight[];   // ← add this
}

export interface KeyInsight {
  id: string;
  message: string;
  color: 'emerald' | 'blue' | 'purple' | 'yellow' | 'red';
}

export const insightsService = {
  async getInsights(): Promise<WellnessInsights> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = wellnessData as WellnessInsights;

        // ── derive key insights dynamically from the data ──────────────

        const keyInsights: KeyInsight[] = [];

        // 1. highest trending demand category
        const topTrend = [...data.demandTrends]
          .filter(t => t.trend === 'up')
          .sort((a, b) => b.changePercentage - a.changePercentage)[0];

        if (topTrend) {
          keyInsights.push({
            id: 'insight-1',
            message: `${topTrend.category}-related recommendations increased ${topTrend.changePercentage}% this month.`,
            color: 'emerald',
          });
        }

        // 2. top requested service
        const topService = [...data.topServices]
          .sort((a, b) => b.requests - a.requests)[0];

        if (topService) {
          keyInsights.push({
            id: 'insight-2',
            message: `${topService.service} is the most requested service with ${topService.requests} requests this month.`,
            color: 'purple',
          });
        }

        // 3. largest age group
        const topAge = [...data.ageDistribution]
          .sort((a, b) => b.value - a.value)[0];

        if (topAge) {
          keyInsights.push({
            id: 'insight-3',
            message: `The ${topAge.ageGroup} age group makes up the largest share of wellness demand at ${topAge.value}%.`,
            color: 'blue',
          });
        }

        // 4. any declining category warning
        const declining = data.demandTrends.filter(t => t.trend === 'down');
        if (declining.length > 0) {
          const names = declining.map(t => t.category).join(', ');
          keyInsights.push({
            id: 'insight-4',
            message: `${names} demand is declining — consider targeted campaigns to re-engage interest.`,
            color: 'yellow',
          });
        }

        resolve({
          ...data,
          keyInsights,
        });

      }, 300);
    });
  },
};