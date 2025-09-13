
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/delivery';

interface OrderOverviewTabProps {
  selectedOrder: Order;
  trackingInfo: {
    trackingNumber: string;
    estimatedDelivery: string;
    carrier: string;
  };
  setTrackingInfo: React.Dispatch<React.SetStateAction<{
    trackingNumber: string;
    estimatedDelivery: string;
    carrier: string;
  }>>;
  handleStatusChange: (orderId: string, newStatus: Order['status']) => void;
  updateTrackingInfo: () => void;
  viewOnMap: (address: Order['address']) => void;
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number) => string;
  getStatusBadgeVariant: (status: Order['status']) => "default" | "secondary" | "destructive" | "outline";
  carriers: { id: string; name: string }[];
}

const OrderOverviewTab: React.FC<OrderOverviewTabProps> = ({
  selectedOrder,
  trackingInfo,
  setTrackingInfo,
  handleStatusChange,
  updateTrackingInfo,
  viewOnMap,
  formatDate,
  formatCurrency,
  getStatusBadgeVariant,
  carriers
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Order Information</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Customer:</span> {selectedOrder.customerName}</p>
            <p><span className="font-medium">Date:</span> {formatDate(selectedOrder.orderDate)}</p>
            <p><span className="font-medium">Total:</span> {formatCurrency(selectedOrder.total)}</p>
            <div>
              <span className="font-medium">Status:</span>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                  {selectedOrder.status}
                </Badge>
                <select 
                  className="ml-2 p-1 border rounded"
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(
                    selectedOrder.id, 
                    e.target.value as Order['status']
                  )}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Delivery Address</h3>
          <div className="space-y-1">
            <p>{selectedOrder.address.street}</p>
            <p>{selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.zipCode}</p>
            <p>{selectedOrder.address.country}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => viewOnMap(selectedOrder.address)}
            >
              View on Map
            </Button>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-3">Tracking Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="trackingNumber" className="block text-sm font-medium mb-1">
              Tracking Number
            </label>
            <Input 
              id="trackingNumber"
              value={trackingInfo.trackingNumber}
              onChange={(e) => setTrackingInfo({
                ...trackingInfo,
                trackingNumber: e.target.value
              })}
              placeholder="Enter tracking number"
            />
          </div>
          <div>
            <label htmlFor="carrier" className="block text-sm font-medium mb-1">
              Carrier
            </label>
            <select
              id="carrier"
              className="w-full p-2 border rounded"
              value={trackingInfo.carrier}
              onChange={(e) => setTrackingInfo({
                ...trackingInfo,
                carrier: e.target.value
              })}
            >
              <option value="">Select carrier</option>
              {carriers.map(carrier => (
                <option key={carrier.id} value={carrier.id}>
                  {carrier.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="estimatedDelivery" className="block text-sm font-medium mb-1">
              Estimated Delivery Date
            </label>
            <Input 
              id="estimatedDelivery"
              type="date"
              value={trackingInfo.estimatedDelivery}
              onChange={(e) => setTrackingInfo({
                ...trackingInfo,
                estimatedDelivery: e.target.value
              })}
            />
          </div>
        </div>
        <Button onClick={updateTrackingInfo}>Update Tracking Information</Button>
      </div>
    </div>
  );
};

export default OrderOverviewTab;
