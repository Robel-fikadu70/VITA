// Managed via GET /api/partner/notifications/:partnerId

export interface Notification {
  id: string;
  type: 'new_referral' | 'booking_update' | 'high_demand' | 'campaign_performance' | 'booking_complete';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  referralId?: string;
  bookingId?: string;
  campaignId?: string;
}

const API_URL = (import.meta as any).env.VITE_PUBLIC_API_URL || 'http://localhost:3000';
import { partnerService } from './partnerService';

export const notificationService = {
  async getAll(): Promise<Notification[]> {
    const partnerId = partnerService.getCurrentPartnerId();
    if (!partnerId) return [];

    const response = await fetch(`${API_URL}/partner/notifications/${partnerId}`);
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  },

  async markAsRead(id: string): Promise<void> {
    // For now, we'll keep the read status local or mock it as the backend doesn't persist it yet
    return new Promise((resolve) => setTimeout(resolve, 200));
  },

  async markAllAsRead(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 300));
  },

  async delete(id: string): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 200));
  },
};
