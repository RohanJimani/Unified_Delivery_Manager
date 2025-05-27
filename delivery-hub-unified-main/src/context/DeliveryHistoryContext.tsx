// context/DeliveryHistoryContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface Delivery {
  id: string;
  platform: string;
  date: string;
  time: string;
  customer: string;
  amount: number;
  location: string;
  status: string;
}

interface DeliveryHistoryContextType {
  deliveries: Delivery[];
  addDelivery: (delivery: Delivery) => void;
}

const DeliveryHistoryContext = createContext<DeliveryHistoryContextType | undefined>(undefined);

export const DeliveryHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  const addDelivery = (delivery: Delivery) => {
    setDeliveries((prev) => [...prev, delivery]);
  };

  return (
    <DeliveryHistoryContext.Provider value={{ deliveries, addDelivery }}>
      {children}
    </DeliveryHistoryContext.Provider>
  );
};

export const useDeliveryHistory = () => {
  const context = useContext(DeliveryHistoryContext);
  if (!context) {
    throw new Error("useDeliveryHistory must be used within a DeliveryHistoryProvider");
  }
  return context;
};
