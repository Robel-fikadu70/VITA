// TODO: Replace with GET /api/notifications
import notificationsData from '../data/notifications.json';

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

export const notificationService = {
  async getAll(): Promise<Notification[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(notificationsData as Notification[]), 300);
    });
  },

  async markAsRead(id: string): Promise<void> {
    // TODO: Replace with PATCH /api/notifications/:id
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 200);
    });
  },

  async markAllAsRead(): Promise<void> {
    // TODO: Replace with PATCH /api/notifications/mark-all-read
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  },

  async delete(id: string): Promise<void> {
    // TODO: Replace with DELETE /api/notifications/:id
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 200);
    });
  },
};
