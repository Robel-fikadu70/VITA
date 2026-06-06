// TODO: Replace with GET /api/bookings
import bookingsData from '../data/bookings.json';

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'No Show';

export interface Booking {
  id: string;
  referralId: string;
  customerName: string;
  service: string;
  date: string;
  bookingId: string;
  status: BookingStatus;
  createdAt: string;
  completedAt?: string;
}

export const bookingService = {
  async getAll(): Promise<Booking[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(bookingsData as Booking[]), 300);
    });
  },

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    // TODO: Replace with PATCH /api/bookings/:id
    return new Promise((resolve) => {
      setTimeout(() => {
        const booking = bookingsData.find((b) => b.id === id);
        if (booking) {
          const updated = {
            ...booking,
            status,
            ...(status === 'Completed' && { completedAt: new Date().toISOString() }),
          } as Booking;
          resolve(updated);
        }
      }, 300);
    });
  },
};
