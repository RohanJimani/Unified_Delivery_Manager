// api.ts

// Simulated delivery platforms
export enum Platform {
  ZEPTO = "Zepto",
  SWIGGY = "Swiggy",
  ZOMATO = "Zomato",
  BLINKIT = "Blinkit"
}

// Delivery status types
export enum DeliveryStatus {
  PENDING = "Pending",
  ASSIGNED = "Assigned",
  PICKED_UP = "Picked Up",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled"
}

// Delivery task interface
export interface DeliveryTask {
  id: string;
  platform: Platform;
  orderNumber: string;
  pickupAddress: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  dropAddress: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  items: string[];
  amount: number;
  status: DeliveryStatus;
  assignedTime: Date;
  estimatedDeliveryTime: Date;
  distance: number; // in km
  earnings: number;
  customerContact?: string;
  specialInstructions?: string;
}

// Generate a random delivery task
const generateRandomTask = (): DeliveryTask => {
  const platforms = Object.values(Platform);
  const platform = platforms[Math.floor(Math.random() * platforms.length)];

  // Base coordinates (Delhi example)
  const baseLat = 28.6139;
  const baseLng = 77.2090;

  // Random coordinates within ~5km
  const pickupLat = baseLat + (Math.random() - 0.5) * 0.05;
  const pickupLng = baseLng + (Math.random() - 0.5) * 0.05;
  const dropLat = baseLat + (Math.random() - 0.5) * 0.05;
  const dropLng = baseLng + (Math.random() - 0.5) * 0.05;

  // Distance estimate
  const distance = Math.round((Math.sqrt(
    Math.pow(pickupLat - dropLat, 2) +
    Math.pow(pickupLng - dropLng, 2)
  ) * 111) * 10) / 10;

  // Names and items
  const restaurants = [
    "Spice Garden", "Urban Bites", "Fresh Fusion", "Royal Kitchen",
    "Green Leaf Cafe", "Tasty Corner", "Food Express", "Flavor House"
  ];
  const customers = [
    "Raj Sharma", "Priya Patel", "Amit Kumar", "Neha Singh",
    "Vikram Mehta", "Ananya Gupta", "Deepak Verma", "Sneha Joshi"
  ];

  const restaurantName = restaurants[Math.floor(Math.random() * restaurants.length)];
  const customerName = customers[Math.floor(Math.random() * customers.length)];

  const allItems = [
    "Butter Chicken", "Dal Makhani", "Paneer Tikka", "Veg Biryani", "Chicken Biryani",
    "Masala Dosa", "Chole Bhature", "Pav Bhaji", "Naan", "Tandoori Roti",
    "Gulab Jamun", "Rasgulla", "Lassi", "Cold Drink", "Mineral Water"
  ];

  const itemCount = Math.floor(Math.random() * 4) + 1;
  const items = Array.from({ length: itemCount }, () => {
    return allItems[Math.floor(Math.random() * allItems.length)];
  });

  const amount = Math.round((Math.random() * 500 + 100) * 10) / 10;
  const earnings = Math.round((distance * 10 + 20 + Math.random() * 30) * 10) / 10;

  const now = new Date();
  const estimatedMinutes = Math.round(distance * 5 + 10 + Math.random() * 15);
  const estimatedDeliveryTime = new Date(now.getTime() + estimatedMinutes * 60000);

  return {
    id: `${platform.substring(0, 1)}-${Math.floor(Math.random() * 1000000)}`,
    platform,
    orderNumber: `${platform.substring(0, 1)}${Math.floor(Math.random() * 10000)}`,
    pickupAddress: {
      name: restaurantName,
      address: `${Math.floor(Math.random() * 100) + 1}, Block ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}, New Delhi`,
      coordinates: { lat: pickupLat, lng: pickupLng }
    },
    dropAddress: {
      name: customerName,
      address: `${Math.floor(Math.random() * 100) + 1}, ${['Sector', 'Block', 'Phase'][Math.floor(Math.random() * 3)]} ${Math.floor(Math.random() * 50) + 1}, New Delhi`,
      coordinates: { lat: dropLat, lng: dropLng }
    },
    items,
    amount,
    status: DeliveryStatus.PENDING,
    assignedTime: now,
    estimatedDeliveryTime,
    distance,
    earnings,
    customerContact: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    specialInstructions: Math.random() > 0.7
      ? ["Please ring the doorbell.", "Leave at the door.", "Call upon arrival."][Math.floor(Math.random() * 3)]
      : undefined
  };
};

// Simulated API endpoints
export const API = {
  // Simulated fetchDeliveries
  fetchDeliveries: async (): Promise<DeliveryTask[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const count = Math.floor(Math.random() * 6) + 3;
    return Array.from({ length: count }, generateRandomTask);
  },

  // Simulated acceptDelivery
  acceptDelivery: async (taskId: string): Promise<DeliveryTask> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...generateRandomTask(),
      id: taskId,
      status: DeliveryStatus.ASSIGNED
    };
  },

  // Simulated rejectDelivery
  rejectDelivery: async (taskId: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: Math.random() > 0.01 };
  },

  // Simulated updateDeliveryStatus
  updateDeliveryStatus: async (taskId: string, status: DeliveryStatus): Promise<DeliveryTask> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...generateRandomTask(),
      id: taskId,
      status
    };
  },

  // Simulated fetchActiveDeliveries
  fetchActiveDeliveries: async (): Promise<DeliveryTask[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const count = Math.floor(Math.random() * 4);
    return Array.from({ length: count }, () => {
      const task = generateRandomTask();
      task.status = [DeliveryStatus.ASSIGNED, DeliveryStatus.PICKED_UP][Math.floor(Math.random() * 2)];
      return task;
    });
  },

  // 🔗 Real API acceptDelivery
  async acceptDeliveryReal(id: string) {
    const res = await fetch(`/api/delivery/accept/${id}`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to accept delivery");
    return res.json();
  },

  // 🔗 Real API rejectDelivery
  async rejectDeliveryReal(id: string) {
    const res = await fetch(`/api/delivery/reject/${id}`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to reject delivery");
    return res.json();
  },

  // 🔗 Real API updateDeliveryStatus
  async updateDeliveryStatusReal(id: string, status: string) {
    const res = await fetch(`/api/delivery/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update status");
    return res.json();
  },

  // saveToHistroy
  saveToHistory: async (task: DeliveryTask) => {
    const token = localStorage.getItem("token"); // or however you store your JWT
    const res = await fetch("/api/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Failed to save to history");
    return await res.json();
  }
};
