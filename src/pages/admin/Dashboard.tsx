
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminLayout from "@/components/admin/AdminLayout";

// Sample data
const salesData = [
  { name: 'Jan', amount: 2400 },
  { name: 'Feb', amount: 1398 },
  { name: 'Mar', amount: 9800 },
  { name: 'Apr', amount: 3908 },
  { name: 'May', amount: 4800 },
  { name: 'Jun', amount: 3800 },
  { name: 'Jul', amount: 4300 },
];

const customerData = [
  { name: 'Jan', count: 120 },
  { name: 'Feb', count: 149 },
  { name: 'Mar', count: 190 },
  { name: 'Apr', count: 201 },
  { name: 'May', count: 252 },
  { name: 'Jun', count: 310 },
  { name: 'Jul', count: 370 },
];

const recentOrders = [
  { id: '#ORD-1001', customer: 'Sarah Johnson', date: '2023-08-15', status: 'Delivered', amount: 89.99 },
  { id: '#ORD-1002', customer: 'Michael Brown', date: '2023-08-14', status: 'Processing', amount: 143.50 },
  { id: '#ORD-1003', customer: 'Emma Wilson', date: '2023-08-14', status: 'Delivered', amount: 76.25 },
  { id: '#ORD-1004', customer: 'David Clark', date: '2023-08-13', status: 'Shipped', amount: 122.75 },
  { id: '#ORD-1005', customer: 'Jennifer Lee', date: '2023-08-12', status: 'Delivered', amount: 94.99 },
];

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      {/* Adjusted card grid for better horizontal distribution */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-2xl font-bold truncate">$24,580.56</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">573</div>
              <p className="text-xs text-muted-foreground">+12.4% from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">370</div>
              <p className="text-xs text-muted-foreground">+19.3% from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">3.2%</div>
              <p className="text-xs text-muted-foreground">+0.5% from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Improved charts layout */}
      <div className="mt-6">
        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="amount" fill="#6e2594" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={customerData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="count" stroke="#deb945" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Improved table layout to eliminate horizontal scrolling */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[15%]">Order ID</TableHead>
                  <TableHead className="w-[25%]">Customer</TableHead>
                  <TableHead className="w-[18%]">Date</TableHead>
                  <TableHead className="w-[22%]">Status</TableHead>
                  <TableHead className="w-[20%] text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">${order.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
