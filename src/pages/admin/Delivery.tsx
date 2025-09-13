
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Order } from '@/types/delivery';
import DeliveryTable from '@/components/admin/delivery/DeliveryTable';
import OrderDetailsCard from '@/components/admin/delivery/OrderDetailsCard';
import { MapDisplay } from '@/components/admin/delivery/MapDisplay';
import { 
  carriers, 
  getStatusBadgeVariant, 
  formatDate, 
  formatTime, 
  formatCurrency, 
  getTrackingUrl 
} from '@/components/admin/delivery/DeliveryUtils';
import { deliveryService, OrderFilters } from '@/services/deliveryService';
import { mapService, Coordinates } from '@/services/mapService';

const AdminDelivery = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInfo, setTrackingInfo] = useState({
    trackingNumber: '',
    estimatedDelivery: '',
    carrier: ''
  });
  const [newTrackingUpdate, setNewTrackingUpdate] = useState({
    location: '',
    status: '',
    description: ''
  });
  const [filterZipCode, setFilterZipCode] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [mapCoordinates, setMapCoordinates] = useState<Coordinates | null>(null);
  const [mapAddress, setMapAddress] = useState<Order['address'] | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      toast.error('You must be an admin to access this page');
    }
  }, [isAdmin, navigate]);

  // Fetch orders from API
  const fetchOrders = async (filters: OrderFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await deliveryService.getOrders({
        status: filterStatus === 'all' ? undefined : filterStatus,
        search: searchQuery || undefined,
        limit: pagination.limit,
        offset: pagination.offset,
        ...filters
      });
      
      setOrders(response.orders);
      setPagination(prev => ({
        ...prev,
        total: response.total
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin, filterStatus, searchQuery, pagination.limit, pagination.offset]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isAdmin) {
        setPagination(prev => ({ ...prev, offset: 0 })); // Reset to first page
        fetchOrders();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await deliveryService.updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Update selected order if it's the one being changed
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update order status';
      toast.error(errorMessage);
    }
  };

  const updateTrackingInfo = async () => {
    if (!selectedOrder) return;
    
    try {
      await deliveryService.updateTrackingInfo(selectedOrder.id, {
        tracking_number: trackingInfo.trackingNumber,
        carrier: trackingInfo.carrier,
        estimated_delivery: trackingInfo.estimatedDelivery || undefined
      });
      
      const updatedOrder = {
        ...selectedOrder,
        trackingNumber: trackingInfo.trackingNumber,
        carrier: trackingInfo.carrier,
        estimatedDelivery: trackingInfo.estimatedDelivery
          ? new Date(trackingInfo.estimatedDelivery).toISOString()
          : undefined
      };
      
      setOrders(orders.map(order => 
        order.id === selectedOrder.id ? updatedOrder : order
      ));
      
      setSelectedOrder(updatedOrder);
      toast.success('Tracking information updated');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update tracking info';
      toast.error(errorMessage);
    }
  };

  const addTrackingUpdate = () => {
    if (!selectedOrder) return;
    
    const newUpdate = {
      id: `upd-${Date.now()}`,
      timestamp: new Date().toISOString(),
      location: newTrackingUpdate.location,
      status: newTrackingUpdate.status,
      description: newTrackingUpdate.description
    };
    
    const updatedOrder = {
      ...selectedOrder,
      trackingUpdates: [
        ...(selectedOrder.trackingUpdates || []),
        newUpdate
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    };
    
    setOrders(orders.map(order => 
      order.id === selectedOrder.id ? updatedOrder : order
    ));
    
    setSelectedOrder(updatedOrder);
    setNewTrackingUpdate({
      location: '',
      status: '',
      description: ''
    });
    
    toast.success('Tracking update added');
  };

  const viewOnMap = async (address: Order['address']) => {
    try {
      toast.info('Getting location coordinates...', { duration: 2000 });
      
      const coordinates = await mapService.geocodeAddress(address);
      setMapCoordinates(coordinates);
      setMapAddress(address);
      
      const addressString = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
      toast.success(`Map loaded for: ${addressString}`, { duration: 3000 });
      
      // Do NOT open external map - keep it in the app
      // mapService.openMap(coordinates, address);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      toast.error(`Map error: ${errorMessage}`);
      
      // Even on error, don't redirect - just show the basic map
      setMapCoordinates({ lat: 0, lng: 0 }); // Default coordinates
      setMapAddress(address);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setTrackingInfo({
      trackingNumber: order.trackingNumber || '',
      estimatedDelivery: order.estimatedDelivery 
        ? new Date(order.estimatedDelivery).toISOString().split('T')[0]
        : '',
      carrier: order.carrier || ''
    });
    setActiveTab('overview');
  };

  const filteredOrders = orders.filter(order => {
    if (filterZipCode && !order.address.zipCode.includes(filterZipCode)) {
      return false;
    }
    if (filterState && !order.address.state.toLowerCase().includes(filterState.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <AdminLayout title="Delivery Management">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading orders...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Delivery Management">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-600 text-lg mb-4">Error loading orders</div>
              <div className="text-sm text-gray-600 mb-4">{error}</div>
              <button 
                onClick={() => fetchOrders()} 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Delivery Management">
      <Helmet>
        <title>Admin - Delivery Management</title>
      </Helmet>
      
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Delivery Management</h1>
          <div className="text-sm text-gray-600">
            Showing {orders.length} of {pagination.total} orders
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by order number, customer name, or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="min-w-[150px]">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Filter by ZIP code"
              value={filterZipCode}
              onChange={(e) => setFilterZipCode(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Filter by state"
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardContent className="p-0">
              <DeliveryTable 
                orders={filteredOrders}
                onViewDetails={handleViewDetails}
                onViewMap={viewOnMap}
                getStatusBadgeVariant={getStatusBadgeVariant}
                formatDate={formatDate}
                formatCurrency={formatCurrency}
              />
            </CardContent>
          </Card>
          
          {/* Pagination Controls */}
          {pagination.total > pagination.limit && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} orders
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }))}
                  disabled={pagination.offset === 0}
                  className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }))}
                  disabled={pagination.offset + pagination.limit >= pagination.total}
                  className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {selectedOrder && (
            <OrderDetailsCard
              selectedOrder={selectedOrder}
              trackingInfo={trackingInfo}
              setTrackingInfo={setTrackingInfo}
              newTrackingUpdate={newTrackingUpdate}
              setNewTrackingUpdate={setNewTrackingUpdate}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleStatusChange={handleStatusChange}
              updateTrackingInfo={updateTrackingInfo}
              addTrackingUpdate={addTrackingUpdate}
              viewOnMap={viewOnMap}
              formatDate={formatDate}
              formatTime={formatTime}
              formatCurrency={formatCurrency}
              getStatusBadgeVariant={getStatusBadgeVariant}
              getTrackingUrl={getTrackingUrl}
              carriers={carriers}
            />
          )}
          
          {/* Map Display */}
          {mapCoordinates && mapAddress && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Delivery Location Map</h3>
                  <button
                    onClick={() => {
                      setMapCoordinates(null);
                      setMapAddress(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Close map"
                  >
                    ✕
                  </button>
                </div>
                <MapDisplay 
                  coordinates={mapCoordinates} 
                  address={mapAddress}
                  height="400px"
                  showExternalButton={false}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDelivery;
