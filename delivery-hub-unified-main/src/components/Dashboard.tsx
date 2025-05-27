import { useState, useEffect } from "react";
import { API, DeliveryTask, DeliveryStatus } from "@/services/api";
import { historyService } from "@/services/historyService";
import DeliveryCard from "@/components/DeliveryCard";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [pendingDeliveries, setPendingDeliveries] = useState<DeliveryTask[]>([]);
  const [activeDeliveries, setActiveDeliveries] = useState<DeliveryTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [tab, setTab] = useState("pending");
  const { toast } = useToast();

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const tasks = await API.fetchDeliveries();

      // Only use statuses that exist in your DeliveryStatus enum
      const pending = tasks.filter(task =>
        task.status === DeliveryStatus.PENDING
      );
      const active = tasks.filter(task =>
        task.status === DeliveryStatus.ASSIGNED || task.status === DeliveryStatus.PICKED_UP
      );

      console.log("Pending tasks:", pending);
      console.log("Active tasks:", active);

      setPendingDeliveries(pending);
      // setActiveDeliveries(active);
      // Save to localStorage
      localStorage.setItem("pendingDeliveries", JSON.stringify(pending));
      localStorage.setItem("activeDeliveries", JSON.stringify(active));
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      toast({
        title: "Error",
        description: "Failed to load delivery tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchDeliveries();
  //   const refreshInterval = setInterval(() => {
  //     handleRefresh();
  //   }, 90000);
  //   return () => clearInterval(refreshInterval);
  //   // eslint-disable-next-line
  // }, []);

  useEffect(() => {
  const savedPending = localStorage.getItem("pendingDeliveries");
  const savedActive = localStorage.getItem("activeDeliveries");

  if (savedPending && savedActive) {
    setPendingDeliveries(JSON.parse(savedPending));
    setActiveDeliveries(JSON.parse(savedActive));
    setLoading(false); // Skip fetch, we have cached data
  } else {
    fetchDeliveries(); // No cache, fetch from API
  }

  const refreshInterval = setInterval(() => {
    handleRefresh();
  }, 90000);

  return () => clearInterval(refreshInterval);
}, []);


  const handleRefresh = async () => {
    if (refreshing) return;
    try {
      setRefreshing(true);
      await fetchDeliveries();
      toast({
        title: "Updated",
        description: "Delivery tasks refreshed",
      });
    } catch (error) {
      console.error("Error refreshing deliveries:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // const handleStatusChange = async (taskId: string, newStatus: DeliveryStatus) => {
  //   try {
  //     // await API.updateDeliveryStatus(taskId, newStatus);

  //     // if (newStatus === DeliveryStatus.DELIVERED) {
  //     //   const deliveredTask = activeDeliveries.find(task => task.id === taskId);
  //     //   if (deliveredTask) {
  //     //     await API.saveToHistory(deliveredTask);
  //     //   }
  //     // }
  //      await API.updateDeliveryStatus(taskId, newStatus);

  //   // Step 2: Remove from active list if marked as DELIVERED (frontend-only cleanup)
  //   if (newStatus === DeliveryStatus.DELIVERED) {
  //     setActiveDeliveries(prev =>
  //       prev.filter(delivery => delivery.id !== taskId)
  //     );
  //   }

  //     setActiveDeliveries(prevTasks => {
  //       let updatedTasks = prevTasks.map(task => 
  //         task.id === taskId ? { ...task, status: newStatus } : task
  //       );
        
  //       if (newStatus === DeliveryStatus.DELIVERED) {
  //         updatedTasks = updatedTasks.filter(task => task.id !== taskId);
  //       }
  //       localStorage.setItem("activeDeliveries", JSON.stringify(updatedTasks));
  //       return updatedTasks;
  //     });

  //     toast({
  //     title: 'Success',
  //     description: `Delivery marked as ${newStatus}`,
  //   });

  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to update delivery status",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleStatusChange = async (taskId: string, newStatus: DeliveryStatus) => {
  try {
    // Step 1: Update status in backend
    await API.updateDeliveryStatus(taskId, newStatus);

    // // Step 2: Remove from active list if marked as DELIVERED (frontend-only cleanup)
    // if (newStatus === DeliveryStatus.DELIVERED) {
    //   setActiveDeliveries(prev =>
    //     prev.filter(delivery => delivery.id !== taskId)
    //   );
    // }

    // Step 3: Update frontend state and localStorage
    setActiveDeliveries(prev => {
      let updatedTasks = prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      );

      // ✅ NEW: Save delivered task to history
      if (newStatus === DeliveryStatus.DELIVERED) {
        console.log("DELIVERED status reached");
       
        console.log("updatedTasks:", updatedTasks);
           console.log("taskId:", taskId);

        // const deliveredTask = updatedTasks.find(task => task.id === taskId);
        const deliveredTask = prev.find(task => task.id === taskId);


        if (deliveredTask) {
          const updatedTask = { ...deliveredTask, status: newStatus };
          console.log("Saving delivered task to history:", updatedTask);
          historyService.saveDeliveredTask(updatedTask); // 👈 Your new logic

          const stored = JSON.parse(localStorage.getItem("deliveryHistory"));
         console.log("🧪 Current localStorage deliveryHistory:", stored);
        }

        // Also remove from UI
        updatedTasks = updatedTasks.filter(task => task.id !== taskId);
      }

      // // Step 2: Remove from active list if marked as DELIVERED (frontend-only cleanup)
    if (newStatus === DeliveryStatus.DELIVERED) {
      setActiveDeliveries(prev =>
        prev.filter(delivery => delivery.id !== taskId)
      );
    }

      localStorage.setItem("activeDeliveries", JSON.stringify(updatedTasks));
      return updatedTasks;
    });

    // Step 4: Show toast
    toast({
      title: 'Success',
      description: `Delivery marked as ${newStatus}`,
    });

  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to update delivery status",
      variant: "destructive",
    });
  }
};


  // const handleAccept = (taskId: string) => {
  //   if (activeDeliveries.length > 0) {
  //   toast({
  //     title: "Cannot Accept New Task",
  //     description: "You must complete your current active task before accepting another.",
  //     variant: "destructive",
  //   });
  //   return;
  // }

  //   const acceptedTask = pendingDeliveries.find(task => task.id === taskId);
  //   if (acceptedTask) {
  //     const updatedTask = { ...acceptedTask, status: DeliveryStatus.ASSIGNED };
  //     setActiveDeliveries(prev => [updatedTask, ...prev]);
  //     setPendingDeliveries(prev => prev.filter(task => task.id !== taskId));
  //     // Optionally call API.acceptDelivery(taskId) here
  //     // localStorage.setItem("pendingDeliveries", JSON.stringify(pendingDeliveries.filter(task => task.id !== taskId)));
  //     localStorage.setItem("activeDeliveries", JSON.stringify([updatedTask, ...activeDeliveries]));

  //     // Optional: API call to mark as accepted
  //   API.updateDeliveryStatus(taskId, DeliveryStatus.ASSIGNED);

  //   }
  // };

  // handleAccept:
const handleAccept = (taskId: string) => {
  if (activeDeliveries.length > 0) {
    toast({
      title: "Cannot Accept New Task",
      description: "You must complete your current active task before accepting another.",
      variant: "destructive",
    });
    return;
  }
  const acceptedTask = pendingDeliveries.find(task => task.id === taskId);
  if (acceptedTask) {
    const updatedTask = { ...acceptedTask, status: DeliveryStatus.ASSIGNED };
    setActiveDeliveries(prev => {
      const newActive = [updatedTask, ...prev];
      localStorage.setItem("activeDeliveries", JSON.stringify(newActive));
      return newActive;
    });
    setPendingDeliveries(prev => {
      const newPending = prev.filter(task => task.id !== taskId);
      localStorage.setItem("pendingDeliveries", JSON.stringify(newPending));
      return newPending;
    });
    API.updateDeliveryStatus(taskId, DeliveryStatus.ASSIGNED);
  }
};

// handleReject:
const handleReject = (taskId: string) => {
  setPendingDeliveries(prev => {
    const updated = prev.filter(task => task.id !== taskId);
    localStorage.setItem("pendingDeliveries", JSON.stringify(updated));
    return updated;
  });
  // Optionally: API.rejectDelivery(taskId);
};


  // const handleReject = (taskId: string) => {
  //   setPendingDeliveries(prev => prev.filter(task => task.id !== taskId));
  //   // Optionally call API.rejectDelivery(taskId) here
  //   localStorage.setItem("pendingDeliveries", JSON.stringify(handleReject));
  // };
  // const handleReject = pendingDeliveries.filter(task => task.id !== task.id);
  // setPendingDeliveries(handleReject);
  // localStorage.setItem("pendingDeliveries", JSON.stringify(handleReject));


  const renderContent = () => {
    if (loading) {
      return (
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-delivery-teal border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading delivery tasks...</p>
        </div>
      );
    }

    return (
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pending{" "}
              {pendingDeliveries.length > 0 && (
                <span className="ml-2 bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs">
                  {pendingDeliveries.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="active">
              Active{" "}
              {activeDeliveries.length > 0 && (
                <span className="ml-2 bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs">
                  {activeDeliveries.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-sm flex items-center"
          >
            {refreshing ? (
              <>
                <span className="mr-2 h-4 w-4 border-2 border-delivery-teal border-t-transparent rounded-full animate-spin"></span>
                Refreshing...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
                Refresh
              </>
            )}
          </Button>
        </div>
        <TabsContent value="pending" className="mt-0">
          {pendingDeliveries.length === 0 ? (
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground mb-4"
                >
                  <path d="M2 9a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
                <p className="text-lg font-medium mb-2">No pending deliveries</p>
                <p className="text-sm text-muted-foreground mb-4">
                  New delivery requests will appear here
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  Check for new deliveries
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingDeliveries.map((task) => (
                <DeliveryCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="active" className="mt-0">
          {activeDeliveries.length === 0 ? (
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground mb-4"
                >
                  <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
                  <path d="m7.5 4.27 9 5.15" />
                  <polyline points="3.29 7 12 12 20.71 7" />
                  <line x1="12" y1="22" x2="12" y2="12" />
                  <circle cx="18.5" cy="15.5" r="2.5" />
                  <path d="M20.27 17.27 22 19" />
                </svg>
                <p className="text-lg font-medium mb-2">No active deliveries</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Accept new deliveries from the Pending tab
                </p>
                <Button variant="outline" onClick={() => setTab("pending")}>
                  View pending deliveries
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeDeliveries.map((task) => (
                <DeliveryCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Delivery Dashboard</h1>
        <p className="text-muted-foreground">
          Manage all your delivery tasks from multiple platforms in one place
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              Pending Tasks
            </CardTitle>
            <CardDescription>Tasks waiting for acceptance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-delivery-blue">
              {pendingDeliveries.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              Active Tasks
            </CardTitle>
            <CardDescription>Tasks in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-delivery-orange">
              {activeDeliveries.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              Estimated Earnings
            </CardTitle>
            <CardDescription>From pending deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-delivery-green">
              ₹{activeDeliveries.reduce((total, task) => total + task.earnings, 0).toFixed(2)}  
            </div>
          </CardContent>
        </Card>
      </div>
      {renderContent()}
    </div>
  );
};

export default Dashboard;
