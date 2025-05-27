import { DeliveryTask, DeliveryStatus } from './api';

export interface HistoryDelivery {
  id: string;
  platform: string;
  date: string;
  time: string;
  customer: string;
  amount: number;
  location: string;
  status: string;
  orderNumber: string;
  earnings: number;
  pickupLocation: string;
  deliveredAt: Date;
}

class HistoryService {
  private storageKey = 'delivery-history';

  // Convert DeliveryTask to HistoryDelivery format
  private convertToHistoryFormat(task: DeliveryTask): HistoryDelivery {
    const now = new Date();
    return {
      id: task.id,
      platform: task.platform,
      date: now.toISOString().split('T')[0], // YYYY-MM-DD format
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customer: task.dropAddress.name,
      amount: task.amount,
      location: task.dropAddress.address,
      status: 'Delivered',
      orderNumber: task.orderNumber,
      earnings: task.earnings,
      pickupLocation: task.pickupAddress.name,
      deliveredAt: now
    };
  }

  // Save a delivered task to history
  saveDeliveredTask(task: DeliveryTask): void {
    try {
      const existingHistory = this.getHistory();
      const historyEntry = this.convertToHistoryFormat(task);
      
      // Add to beginning of array (most recent first)
      const updatedHistory = [historyEntry, ...existingHistory];
      
      localStorage.setItem(this.storageKey, JSON.stringify(updatedHistory));
      console.log('Task saved to history:', task.id);
    } catch (error) {
      console.error('Failed to save task to history:', error);
    }
  }

  // Get all delivery history
  getHistory(): HistoryDelivery[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load history:', error);
      return [];
    }
  }

  // Clear all history (optional utility method)
  clearHistory(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const historyService = new HistoryService();