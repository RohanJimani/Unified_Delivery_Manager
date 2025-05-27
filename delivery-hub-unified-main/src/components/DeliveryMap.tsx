
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapProps {
  pickupLocation?: Coordinates;
  dropLocation?: Coordinates;
  currentLocation?: Coordinates;
}

const DeliveryMap = ({ 
  pickupLocation, 
  dropLocation, 
  currentLocation 
}: MapProps) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    // In a real app, this would integrate with Google Maps or a similar mapping API
    // For the mockup, we'll just simulate loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Card className="w-full h-full min-h-[400px] overflow-hidden relative">
      {!mapLoaded ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-delivery-teal border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-[#f8f9fa]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4 bg-white/80 rounded-lg backdrop-blur-sm">
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
                className="mx-auto mb-2 text-delivery-teal"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
              <h3 className="text-lg font-medium mb-2">Map Visualization</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This is a placeholder for the Google Maps integration.
              </p>
              <div className="text-xs text-left space-y-2 max-w-xs mx-auto">
                {pickupLocation && (
                  <div>
                    <span className="font-medium">Pickup:</span> 
                    <span className="ml-1">
                      {pickupLocation.lat.toFixed(4)}, {pickupLocation.lng.toFixed(4)}
                    </span>
                  </div>
                )}
                {dropLocation && (
                  <div>
                    <span className="font-medium">Delivery:</span> 
                    <span className="ml-1">
                      {dropLocation.lat.toFixed(4)}, {dropLocation.lng.toFixed(4)}
                    </span>
                  </div>
                )}
                {currentLocation && (
                  <div>
                    <span className="font-medium">Current:</span> 
                    <span className="ml-1">
                      {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DeliveryMap;
