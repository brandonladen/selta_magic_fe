import { Order } from '@/types/delivery';

export const carriers = [
  { id: 'usps', name: 'USPS' },
  { id: 'ups', name: 'UPS' },
  { id: 'fedex', name: 'FedEx' },
  { id: 'dhl', name: 'DHL' }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-12345',
    customerName: 'John Doe',
    orderDate: '2023-05-15T10:30:00',
    status: 'shipped',
    total: 78.95,
    address: {
      street: '123 Main St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    trackingNumber: 'TRK-7890123',
    estimatedDelivery: '2023-05-20T00:00:00',
    carrier: 'usps',
    trackingUpdates: [
      {
        id: 'upd-1',
        timestamp: '2023-05-15T14:30:00',
        location: 'Los Angeles, CA',
        status: 'Processing',
        description: 'Order has been processed and is ready for shipment'
      },
      {
        id: 'upd-2',
        timestamp: '2023-05-16T09:15:00',
        location: 'Los Angeles, CA',
        status: 'Picked Up',
        description: 'Package has been picked up by carrier'
      },
      {
        id: 'upd-3',
        timestamp: '2023-05-17T11:20:00',
        location: 'San Francisco, CA',
        status: 'In Transit',
        description: 'Package is in transit to the destination'
      }
    ],
    items: [
      { id: 'item-1', name: 'Magic Shampoo', quantity: 2, price: 24.99 },
      { id: 'item-2', name: 'Strengthening Conditioner', quantity: 1, price: 28.97 }
    ]
  },
  {
    id: 'ORD-12346',
    customerName: 'Jane Smith',
    orderDate: '2023-05-16T14:45:00',
    status: 'processing',
    total: 125.50,
    address: {
      street: '456 Oak Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'USA'
    },
    items: [
      { id: 'item-3', name: 'Hair Growth Serum', quantity: 1, price: 59.99 },
      { id: 'item-4', name: 'Styling Gel', quantity: 2, price: 32.75 }
    ]
  }
];

export const getStatusBadgeVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'processing':
      return 'outline';
    case 'shipped':
      return 'default';
    case 'delivered':
      return 'default';
    default:
      return 'secondary';
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount: number) => {
  return `$${amount.toFixed(2)}`;
};

export const getTrackingUrl = (carrier: string, trackingNumber: string) => {
  switch (carrier) {
    case 'usps':
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
    case 'ups':
      return `https://www.ups.com/track?tracknum=${trackingNumber}`;
    case 'fedex':
      return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
    case 'dhl':
      return `https://www.dhl.com/us-en/home/tracking/tracking-parcel.html?submit=1&tracking-id=${trackingNumber}`;
    default:
      return '#';
  }
};
