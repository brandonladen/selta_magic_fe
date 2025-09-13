
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Order } from '@/types/delivery';

interface OrderItemsTabProps {
  selectedOrder: Order;
  formatCurrency: (amount: number) => string;
}

const OrderItemsTab: React.FC<OrderItemsTabProps> = ({
  selectedOrder,
  formatCurrency
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Order Items</h3>
      {selectedOrder.items && selectedOrder.items.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedOrder.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatCurrency(item.price)}</TableCell>
                <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-gray-500 italic">No items available</p>
      )}
    </div>
  );
};

export default OrderItemsTab;
