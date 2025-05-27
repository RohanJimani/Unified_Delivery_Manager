import React, { useState, useEffect } from "react";
import { historyService, HistoryDelivery } from "@/services/historyService";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { History as HistoryIcon, Calendar } from "lucide-react";

// Sample data for past deliveries
const pastDeliveries = [
  {
    id: "DEL-1234",
    platform: "Swiggy",
    date: "2025-05-12",
    time: "13:45",
    customer: "John Doe",
    amount: 15.99,
    location: "123 Main St",
    status: "Delivered"
  },
  {
    id: "DEL-1235",
    platform: "Zomato",
    date: "2025-05-12",
    time: "14:30",
    customer: "Jane Smith",
    amount: 24.50,
    location: "456 Oak Ave",
    status: "Delivered"
  },
  {
    id: "DEL-1236",
    platform: "Blinkit",
    date: "2025-05-11",
    time: "10:15",
    customer: "Mike Johnson",
    amount: 18.75,
    location: "789 Pine Rd",
    status: "Delivered"
  },
  {
    id: "DEL-1237",
    platform: "Zepto",
    date: "2025-05-10",
    time: "19:20",
    customer: "Sarah Williams",
    amount: 32.00,
    location: "101 Cedar Ln",
    status: "Delivered"
  },
  {
    id: "DEL-1238",
    platform: "Swiggy",
    date: "2025-05-10",
    time: "12:05",
    customer: "Robert Brown",
    amount: 21.25,
    location: "202 Maple Dr",
    status: "Delivered"
  },
];

const History = () => {
  const [timeFilter, setTimeFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [deliveryHistory, setDeliveryHistory] = useState<HistoryDelivery[]>([]);

  useEffect(() => {
    // Load history from localStorage on component mount
    const history = historyService.getHistory();
    setDeliveryHistory(history);
  }, []);

  // Filter the deliveries based on selected filters
  const filteredDeliveries = deliveryHistory.filter((delivery) => {
    const matchesPlatform = platformFilter === "all" || delivery.platform.toLowerCase() === platformFilter;
    
    if (timeFilter === "all") return matchesPlatform;
    
    const today = new Date();
    const deliveryDate = new Date(delivery.date);
    
    if (timeFilter === "today") {
      return matchesPlatform && 
        deliveryDate.getDate() === today.getDate() &&
        deliveryDate.getMonth() === today.getMonth() &&
        deliveryDate.getFullYear() === today.getFullYear();
    }
    
    if (timeFilter === "thisWeek") {
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      return matchesPlatform && deliveryDate >= oneWeekAgo;
    }
    
    if (timeFilter === "thisMonth") {
      return matchesPlatform && 
        deliveryDate.getMonth() === today.getMonth() &&
        deliveryDate.getFullYear() === today.getFullYear();
    }
    
    return false;
  });

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "swiggy":
        return "bg-orange-500";
      case "zomato":
        return "bg-red-500";
      case "blinkit":
        return "bg-green-500";
      case "zepto":
        return "bg-purple-500";
      default:
        return "bg-blue-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const refreshHistory = () => {
    const history = historyService.getHistory();
    setDeliveryHistory(history);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <HistoryIcon className="w-6 h-6 text-delivery-teal" />
          <h1 className="text-2xl font-bold">Delivery History</h1>
        </div>
        <Button variant="outline" className="flex items-center space-x-1" onClick={refreshHistory}>
          <Calendar className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <Tabs defaultValue="all" onValueChange={setTimeFilter} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All Time</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="thisWeek">This Week</TabsTrigger>
              <TabsTrigger value="thisMonth">This Month</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="w-full sm:w-48">
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="swiggy">Swiggy</SelectItem>
                <SelectItem value="zomato">Zomato</SelectItem>
                <SelectItem value="blinkit">Blinkit</SelectItem>
                <SelectItem value="zepto">Zepto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableCaption>A history of all your completed deliveries.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Earnings</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeliveries.length > 0 ? (
              filteredDeliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">{delivery.orderNumber}</TableCell>
                  <TableCell>
                    <span className={`inline-block w-3 h-3 rounded-full ${getPlatformColor(delivery.platform)} mr-2`}></span>
                    {delivery.platform}
                  </TableCell>
                  <TableCell>{delivery.date} {delivery.time}</TableCell>
                  <TableCell>{delivery.customer}</TableCell>
                  <TableCell>₹{delivery.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-delivery-green">₹{delivery.earnings.toFixed(2)}</TableCell>
                  <TableCell className="max-w-[150px] truncate" title={delivery.location}>{delivery.location}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                      {delivery.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  {deliveryHistory.length === 0 
                    ? "No completed deliveries yet. Complete some deliveries to see them here!"
                    : "No deliveries found matching the selected filters."
                  }
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default History;