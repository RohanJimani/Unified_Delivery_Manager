
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import DeliveryMap from "@/components/DeliveryMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { API, DeliveryTask, DeliveryStatus } from "@/services/api";
import { Badge } from "@/components/ui/badge";

interface Coordinates {
  lat: number;
  lng: number;
}

const MapPage = () => {
  const [activeDeliveries, setActiveDeliveries] = useState<DeliveryTask[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryTask | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentLocation, setCurrentLocation] = useState<Coordinates>({
    lat: 28.6139, // Delhi, India as example
    lng: 77.2090,
  });


  useEffect(() => {
  const loadDeliveries = () => {
    setLoading(true);
    try {
      const savedActive = localStorage.getItem("activeDeliveries");

      if (savedActive) {
        const active: DeliveryTask[] = JSON.parse(savedActive);
        setActiveDeliveries(active);

        if (active.length > 0) {
          setSelectedDelivery(active[0]);
        }
      } else {
        console.warn("No active deliveries in localStorage.");
      }
    } catch (error) {
      console.error("Error loading active deliveries from localStorage:", error);
    } finally {
      setLoading(false);
    }
  };

  loadDeliveries();

  // Simulate changing current location
  const locationInterval = setInterval(() => {
    setCurrentLocation(prev => ({
      lat: prev.lat + (Math.random() - 0.5) * 0.001,
      lng: prev.lng + (Math.random() - 0.5) * 0.001,
    }));
  }, 5000);

  return () => clearInterval(locationInterval);
}, []);


  // useEffect(() => {
  //   const fetchDeliveries = async () => {
  //     try {
  //       setLoading(true);
  //       const active = await API.fetchActiveDeliveries();
  //       setActiveDeliveries(active);
        
  //       if (active.length > 0) {
  //         setSelectedDelivery(active[0]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching deliveries:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
    
  //   fetchDeliveries();
    
  //   // Simulate changing current location
  //   const locationInterval = setInterval(() => {
  //     setCurrentLocation(prev => ({
  //       lat: prev.lat + (Math.random() - 0.5) * 0.001,
  //       lng: prev.lng + (Math.random() - 0.5) * 0.001,
  //     }));
  //   }, 5000);
    
  //   return () => clearInterval(locationInterval);
  // }, []);
  
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Zepto":
        return "bg-[#8C52FF] text-white";
      case "Swiggy":
        return "bg-[#FF7800] text-white";
      case "Zomato":
        return "bg-[#EF4F5F] text-white";
      case "Blinkit":
        return "bg-[#0CBA41] text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case DeliveryStatus.PENDING:
        return "bg-blue-100 text-blue-800";
      case DeliveryStatus.ASSIGNED:
        return "bg-orange-100 text-orange-800";
      case DeliveryStatus.PICKED_UP:
        return "bg-purple-100 text-purple-800";
      case DeliveryStatus.DELIVERED:
        return "bg-green-100 text-green-800";
      case DeliveryStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Delivery Map</h1>
          <p className="text-muted-foreground">
            Track and visualize all your active delivery routes
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="p-0 h-[600px]">
                <DeliveryMap 
                  pickupLocation={selectedDelivery?.pickupAddress.coordinates}
                  dropLocation={selectedDelivery?.dropAddress.coordinates}
                  currentLocation={currentLocation}
                />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle>Active Deliveries</CardTitle>
                <CardDescription>
                  Click on a delivery to view its route
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-delivery-teal border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : activeDeliveries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No active deliveries</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeDeliveries.map(delivery => (
                      <div 
                        key={delivery.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedDelivery?.id === delivery.id 
                            ? "border-delivery-teal bg-delivery-teal/5" 
                            : "border-border hover:border-delivery-teal/50"
                        }`}
                        onClick={() => setSelectedDelivery(delivery)}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <Badge className={`platform-tag ${getPlatformColor(delivery.platform)}`}>
                            {delivery.platform}
                          </Badge>
                          <Badge className={`status-badge ${getStatusColor(delivery.status)}`}>
                            {delivery.status}
                          </Badge>
                        </div>
                        <div className="mb-1">
                          <div className="text-sm font-medium">{delivery.orderNumber}</div>
                          <div className="text-xs text-muted-foreground">{delivery.pickupAddress.name} → {delivery.dropAddress.name}</div>
                        </div>
                        <div className="text-xs flex justify-between">
                          <span>{delivery.distance} km</span>
                          <span className="text-delivery-green">₹{delivery.earnings.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Your Current Location</CardTitle>
                <CardDescription>
                  Location is being tracked for deliveries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-subtle mr-2"></div>
                  <span className="text-sm font-medium">Live Tracking Active</span>
                </div>
                <div className="text-sm">
                  <div><span className="font-medium">Latitude:</span> {currentLocation.lat.toFixed(6)}</div>
                  <div><span className="font-medium">Longitude:</span> {currentLocation.lng.toFixed(6)}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapPage;
