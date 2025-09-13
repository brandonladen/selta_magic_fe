
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/delivery';

interface DeliveryTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onViewMap: (address: Order['address']) => void;
  getStatusBadgeVariant: (status: Order['status']) => "default" | "secondary" | "destructive" | "outline";
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number) => string;
}

const DeliveryTable: React.FC<DeliveryTableProps> = ({
  orders,
  onViewDetails,
  onViewMap,
  getStatusBadgeVariant,
  formatDate,
  formatCurrency
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order Number</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Location</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.order_number}</TableCell>
            <TableCell>{order.customerName}</TableCell>
            <TableCell>{formatDate(order.orderDate)}</TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(order.status)}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>{formatCurrency(order.total)}</TableCell>
            <TableCell>
              {order.address.city}, {order.address.state}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewDetails(order)}
                >
                  Manage
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onViewMap(order.address)}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                >
                  📍 Map
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DeliveryTable;
