// TODO: Replace with GET /api/campaigns
import campaignsData from '../data/campaigns.json';

export interface Campaign {
  id: string;
  name: string;
  description: string;
  discountPercentage: number;
  serviceCategory: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Paused' | 'Ended';
  metrics: {
    views: number;
    clicks: number;
    bookings: number;
    conversionRate: number;
  };
}

export interface CreateCampaignInput {
  name: string;
  description: string;
  discountPercentage: number;
  serviceCategory: string;
  startDate: string;
  endDate: string;
}

export const campaignService = {
  async getAll(): Promise<Campaign[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(campaignsData as Campaign[]), 300);
    });
  },

  async create(input: CreateCampaignInput): Promise<Campaign> {
    // TODO: Replace with POST /api/campaigns
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCampaign: Campaign = {
          ...input,
          id: `CAMP-${String(campaignsData.length + 1).padStart(3, '0')}`,
          status: 'Active',
          metrics: {
            views: 0,
            clicks: 0,
            bookings: 0,
            conversionRate: 0,
          },
        };
        resolve(newCampaign);
      }, 300);
    });
  },

  async update(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    // TODO: Replace with PATCH /api/campaigns/:id
    return new Promise((resolve) => {
      setTimeout(() => {
        const campaign = campaignsData.find((c) => c.id === id);
        if (campaign) {
          resolve({ ...campaign, ...updates } as Campaign);
        }
      }, 300);
    });
  },

  async delete(id: string): Promise<void> {
    // TODO: Replace with DELETE /api/campaigns/:id
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  },
};
