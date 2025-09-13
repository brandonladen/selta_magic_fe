
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/delivery';

interface TrackingTabProps {
  selectedOrder: Order;
  newTrackingUpdate: {
    location: string;
    status: string;
    description: string;
  };
  setNewTrackingUpdate: React.Dispatch<React.SetStateAction<{
    location: string;
    status: string;
    description: string;
  }>>;
  addTrackingUpdate: () => void;
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
  getTrackingUrl: (carrier: string, trackingNumber: string) => string;
  carriers: { id: string; name: string }[];
}

const TrackingTab: React.FC<TrackingTabProps> = ({
  selectedOrder,
  newTrackingUpdate,
  setNewTrackingUpdate,
  addTrackingUpdate,
  formatDate,
  formatTime,
  getTrackingUrl,
  carriers
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Current Tracking Status</h3>
      {selectedOrder.trackingNumber ? (
        <div className="mb-4">
          <p className="mb-2">
            <span className="font-medium">Tracking Number:</span> {selectedOrder.trackingNumber}
            {selectedOrder.carrier && (
              <Button 
                variant="link" 
                className="ml-2 p-0 h-auto text-blue-600"
                onClick={() => {
                  const url = getTrackingUrl(selectedOrder.carrier!, selectedOrder.trackingNumber!);
                  window.open(url, '_blank');
                }}
              >
                Track on {carriers.find(c => c.id === selectedOrder.carrier)?.name} Website
              </Button>
            )}
          </p>
          {selectedOrder.carrier && (
            <p className="mb-2">
              <span className="font-medium">Carrier:</span> {carriers.find(c => c.id === selectedOrder.carrier)?.name}
            </p>
          )}
          {selectedOrder.estimatedDelivery && (
            <p className="mb-2">
              <span className="font-medium">Estimated Delivery:</span> {formatDate(selectedOrder.estimatedDelivery)}
            </p>
          )}
        </div>
      ) : (
        <p className="text-gray-500 italic mb-4">No tracking information available</p>
      )}
      
      <h3 className="text-lg font-medium mb-3">Add Tracking Update</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="updateLocation" className="block text-sm font-medium mb-1">
            Location
          </label>
          <Input 
            id="updateLocation"
            value={newTrackingUpdate.location}
            onChange={(e) => setNewTrackingUpdate({
              ...newTrackingUpdate,
              location: e.target.value
            })}
            placeholder="Enter location (e.g. Los Angeles, CA)"
          />
        </div>
        <div>
          <label htmlFor="updateStatus" className="block text-sm font-medium mb-1">
            Status
          </label>
          <Input 
            id="updateStatus"
            value={newTrackingUpdate.status}
            onChange={(e) => setNewTrackingUpdate({
              ...newTrackingUpdate,
              status: e.target.value
            })}
            placeholder="Enter status (e.g. In Transit)"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="updateDescription" className="block text-sm font-medium mb-1">
            Description
          </label>
          <Textarea 
            id="updateDescription"
            value={newTrackingUpdate.description}
            onChange={(e) => setNewTrackingUpdate({
              ...newTrackingUpdate,
              description: e.target.value
            })}
            placeholder="Enter detailed description of the update"
            rows={3}
          />
        </div>
      </div>
      <Button 
        onClick={addTrackingUpdate}
        disabled={!newTrackingUpdate.location || !newTrackingUpdate.status}
      >
        Add Update
      </Button>
      
      <h3 className="text-lg font-medium mt-6 mb-3">Tracking History</h3>
      {selectedOrder.trackingUpdates && selectedOrder.trackingUpdates.length > 0 ? (
        <div className="relative border-l-2 border-gray-200 ml-3 pl-6 space-y-6">
          {selectedOrder.trackingUpdates.map((update) => (
            <div key={update.id} className="relative">
              <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full bg-primary"></div>
              <div className="mb-1 flex items-center">
                <Badge className="mr-2">{update.status}</Badge>
                <span className="text-sm text-gray-500">
                  {formatDate(update.timestamp)} at {formatTime(update.timestamp)}
                </span>
              </div>
              <p className="font-medium">{update.location}</p>
              <p className="text-gray-600">{update.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No tracking updates available</p>
      )}
    </div>
  );
};

export default TrackingTab;
