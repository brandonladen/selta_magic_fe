
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Order } from '@/types/delivery';
import OrderOverviewTab from './OrderOverviewTab';
import TrackingTab from './TrackingTab';
import OrderItemsTab from './OrderItemsTab';

interface OrderDetailsCardProps {
  selectedOrder: Order | null;
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
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  handleStatusChange: (orderId: string, newStatus: Order['status']) => void;
  updateTrackingInfo: () => void;
  addTrackingUpdate: () => void;
  viewOnMap: (address: Order['address']) => void;
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
  formatCurrency: (amount: number) => string;
  getStatusBadgeVariant: (status: Order['status']) => "default" | "secondary" | "destructive" | "outline";
  getTrackingUrl: (carrier: string, trackingNumber: string) => string;
  carriers: { id: string; name: string }[];
}

const OrderDetailsCard: React.FC<OrderDetailsCardProps> = ({
  selectedOrder,
  trackingInfo,
  setTrackingInfo,
  newTrackingUpdate,
  setNewTrackingUpdate,
  activeTab,
  setActiveTab,
  handleStatusChange,
  updateTrackingInfo,
  addTrackingUpdate,
  viewOnMap,
  formatDate,
  formatTime,
  formatCurrency,
  getStatusBadgeVariant,
  getTrackingUrl,
  carriers
}) => {
  if (!selectedOrder) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Manage Order: {selectedOrder.id}</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OrderOverviewTab
              selectedOrder={selectedOrder}
              trackingInfo={trackingInfo}
              setTrackingInfo={setTrackingInfo}
              handleStatusChange={handleStatusChange}
              updateTrackingInfo={updateTrackingInfo}
              viewOnMap={viewOnMap}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              getStatusBadgeVariant={getStatusBadgeVariant}
              carriers={carriers}
            />
          </TabsContent>
          
          <TabsContent value="tracking">
            <TrackingTab
              selectedOrder={selectedOrder}
              newTrackingUpdate={newTrackingUpdate}
              setNewTrackingUpdate={setNewTrackingUpdate}
              addTrackingUpdate={addTrackingUpdate}
              formatDate={formatDate}
              formatTime={formatTime}
              getTrackingUrl={getTrackingUrl}
              carriers={carriers}
            />
          </TabsContent>
          
          <TabsContent value="items">
            <OrderItemsTab
              selectedOrder={selectedOrder}
              formatCurrency={formatCurrency}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OrderDetailsCard;
