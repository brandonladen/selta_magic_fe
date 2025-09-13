
export type TrackingUpdate = {
  id: string;
  timestamp: string;
  location: string;
  status: string;
  description: string;
};

export type Order = {
  id: string;
  order_number: string;
  customerName: string;
  orderDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  carrier?: string;
  trackingUpdates?: TrackingUpdate[];
  items?: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
};
