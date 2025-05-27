import { useState } from "react";
import { DeliveryTask, DeliveryStatus, API } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface DeliveryCardProps {
  task: DeliveryTask;
  onStatusChange?: (taskId: string, newStatus: DeliveryStatus) => void;
  onAccept?: (taskId: string) => void;
  onReject?: (taskId: string) => void;
}

const DeliveryCard = ({ 
  task, 
  onStatusChange, 
  onAccept,
  onReject 
}: DeliveryCardProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getPlatformColor = () => {
    switch (task.platform) {
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

  const getStatusColor = () => {
    switch (task.status) {
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

  const handleAccept = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      await API.acceptDelivery(task.id);
      toast({
        title: "Delivery Accepted",
        description: `You've accepted the delivery from ${task.pickupAddress.name}`,
      });
      if (onAccept) {
        onAccept(task.id);
      }
      if (onStatusChange) {
        onStatusChange(task.id, DeliveryStatus.ASSIGNED);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept delivery",
        variant: "destructive",
      });
      console.error("Failed to accept delivery:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      await API.rejectDelivery(task.id);
      toast({
        title: "Delivery Rejected",
        description: "The delivery has been rejected",
      });
      if (onReject) {
        onReject(task.id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject delivery",
        variant: "destructive",
      });
      console.error("Failed to reject delivery:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: DeliveryStatus) => {
    if (loading) return;
    
    try {
      setLoading(true);
      await API.updateDeliveryStatus(task.id, newStatus);
      
      let statusMessage = "";
      switch (newStatus) {
        case DeliveryStatus.PICKED_UP:
          statusMessage = "Order picked up successfully";
          break;
        case DeliveryStatus.DELIVERED:
          statusMessage = "Order delivered successfully";
          break;
        default:
          statusMessage = `Status updated to ${newStatus}`;
      }
      
      toast({
        title: "Status Updated",
        description: statusMessage,
      });
      
      if (onStatusChange) {
        onStatusChange(task.id, newStatus);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update delivery status",
        variant: "destructive",
      });
      console.error("Failed to update status:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFormattedTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

 const initialEarnings = task.earnings ?? 0;



  const isPending = task.status === DeliveryStatus.PENDING;
  const isAssigned = task.status === DeliveryStatus.ASSIGNED;
  const isPickedUp = task.status === DeliveryStatus.PICKED_UP;

  return (
    <Card className="delivery-card w-full overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          {/* Header with platform and status */}
          <div className="flex justify-between items-center mb-3">
            <Badge className={`platform-tag ${getPlatformColor()}`}>
              {task.platform}
            </Badge>
            <Badge className={`status-badge ${getStatusColor()}`}>
              {task.status}
            </Badge>
          </div>
          
          {/* Locations */}
          <div className="space-y-3 mb-3">
            <div className="flex">
              <div className="mr-3 pt-1">
                <div className="w-3 h-3 rounded-full bg-delivery-green"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{task.pickupAddress.name}</p>
                <p className="text-xs text-muted-foreground">{task.pickupAddress.address}</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-3 flex flex-col items-center">
                <div className="w-0.5 h-4 bg-gray-300 mb-1"></div>
                <div className="w-3 h-3 rounded-full bg-delivery-red"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{task.dropAddress.name}</p>
                <p className="text-xs text-muted-foreground">{task.dropAddress.address}</p>
              </div>
            </div>
          </div>
          
          {/* Order details */}
          <div className="flex justify-between items-center text-sm mb-3">
            <div>
              <p className="text-sm">
                <span className="font-medium">Order:</span> 
                <span className="ml-1">{task.orderNumber}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {task.items.length} item{task.items.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">₹{task.amount?.toFixed(2)}</p>
              <p className="text-xs text-delivery-green">
                + ₹{initialEarnings.toFixed(2)} earnings
              </p>
            </div>
          </div>
          
          {/* Time and distance */}
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <p>
              <span className="font-medium">ETA:</span> 
              <span className="ml-1">{getFormattedTime(task.estimatedDeliveryTime)}</span>
            </p>
            <p>{task.distance} km</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 border-t bg-gray-50 flex justify-between">
        {isPending && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 mr-2"
              disabled={loading}
              onClick={handleReject}
            >
              Reject
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-delivery-teal hover:bg-delivery-blue"
              disabled={loading}
              onClick={handleAccept}
            >
              Accept
            </Button>
          </>
        )}
        
    {task.status === DeliveryStatus.ASSIGNED && (
  <Button 
    onClick={() => handleUpdateStatus(DeliveryStatus.PICKED_UP)}
    disabled={loading}
  >
    Mark as Picked Up
  </Button>
)}
{task.status === DeliveryStatus.PICKED_UP && (
  <Button 
    onClick={() => handleUpdateStatus(DeliveryStatus.DELIVERED)}
    disabled={loading}
  >
    Mark as Delivered
  </Button>
)}
      </CardFooter>
    </Card>
  );
};

export default DeliveryCard;
