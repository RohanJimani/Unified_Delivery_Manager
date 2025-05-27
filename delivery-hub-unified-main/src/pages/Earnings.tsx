import React from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { historyService, HistoryDelivery } from "@/services/historyService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Earnings = () => {
  const { agent } = useAuth();
  const deliveryHistory = historyService.getHistory();

  // Calculate earnings from actual delivery history
  const calculateEarnings = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYearStart = new Date(now.getFullYear(), 0, 1);

    let weeklyEarnings = 0;
    let monthlyEarnings = 0;
    let yearlyEarnings = 0;

    deliveryHistory.forEach((delivery: HistoryDelivery) => {
      const deliveryDate = new Date(delivery.date);
      const earnings = delivery.earnings || 0;

      // Weekly earnings
      if (deliveryDate >= thisWeekStart) {
        weeklyEarnings += earnings;
      }

      // Monthly earnings
      if (deliveryDate >= thisMonthStart) {
        monthlyEarnings += earnings;
      }

      // Yearly earnings
      if (deliveryDate >= thisYearStart) {
        yearlyEarnings += earnings;
      }
    });

    return {
      weeklyEarnings,
      monthlyEarnings,
      yearlyEarnings
    };
  };

  const { weeklyEarnings, monthlyEarnings, yearlyEarnings } = calculateEarnings();

  // Get recent payments (last 5 deliveries)
  const recentPayments = deliveryHistory.slice(0, 5).map((delivery, index) => ({
    id: index + 1,
    date: delivery.date,
    amount: delivery.earnings || 0,
    platform: delivery.platform,
    status: "completed"
  }));

  // For demo purposes, keep some pending payments as sample data
  const pendingPayments = [
    { id: 6, date: "2025-05-27", amount: 35.90, platform: "Swiggy", status: "pending" },
    { id: 7, date: "2025-05-27", amount: 27.45, platform: "Zomato", status: "pending" },
  ];

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "swiggy": return "text-orange-600";
      case "zomato": return "text-red-600";
      case "blinkit": return "text-green-600";
      case "zepto": return "text-purple-600";
      default: return "text-gray-600";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Earnings Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Weekly Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{weeklyEarnings.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{monthlyEarnings.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Yearly Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{yearlyEarnings.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="payments" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="payments">Recent Payments</TabsTrigger>
            <TabsTrigger value="pending">Pending Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Your last 5 completed deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPayments.length > 0 ? (
                      recentPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell className={getPlatformColor(payment.platform)}>
                            {payment.platform}
                          </TableCell>
                          <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {payment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                          No completed deliveries yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Payments</CardTitle>
                <CardDescription>Payments that are being processed</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell className={getPlatformColor(payment.platform)}>
                          {payment.platform}
                        </TableCell>
                        <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Earnings;