import { analyticsService } from './analyticsService';

export interface Partner {
  id: string;
  name: string;
  type: string;
  category: string;
  price: string;
  discount: string;
  discountLabel: string;
  emoji: string;
  location: string;
  description: string;
}

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = (import.meta as any).env.VITE_PUBLIC_API_URL || (isLocal ? 'http://localhost:3000' : 'https://vita-7riw.onrender.com');

console.log(`[VITAL-ETHIO] Using API URL: ${API_URL}`);

export const partnerService = {
  async getPartners(): Promise<Partner[]> {
    try {
      const response = await fetch(`${API_URL}/providers`);
      if (!response.ok) {
        throw new Error('Failed to fetch partners');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching partners:', error);
      // Fallback to empty list or basic info if backend is down
      return [];
    }
  },

  getCurrentPartnerId(): string | null {
    return localStorage.getItem('vital-ethio-partner-id');
  },

  setCurrentPartnerId(id: string) {
    localStorage.setItem('vital-ethio-partner-id', id);
  },

  logout() {
    localStorage.removeItem('vital-ethio-auth');
    localStorage.removeItem('vital-ethio-partner-id');
  }
};
