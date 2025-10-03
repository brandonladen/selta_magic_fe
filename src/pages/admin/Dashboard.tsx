
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminLayout from "@/components/admin/AdminLayout";
import { config } from "@/config/environment";

// Dashboard data interfaces
interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  conversionRate: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  conversionChange: number;
}

interface SalesData {
  name: string;
  amount: number;
}

interface CustomerData {
  name: string;
  count: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  date: string;
  status: string;
  amount: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    conversionRate: 0,
    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0,
    conversionChange: 0,
  });
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch orders data for recent orders and basic stats
      const ordersResponse = await fetch(`${config.apiBaseUrl}/admin/orders?limit=5`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!ordersResponse.ok) {
        throw new Error('Failed to fetch orders data');
      }

      const ordersData = await ordersResponse.json();
      const orders = ordersData.orders || [];

      // Process recent orders
      const processedOrders = orders.map((order: any) => ({
        id: order.order_number || `#ORD-${order.id}`,
        customer: order.customer_name,
        date: new Date(order.order_date).toLocaleDateString(),
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        amount: parseFloat(order.total),
      }));

      setRecentOrders(processedOrders);

      // Calculate basic stats from orders
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + parseFloat(order.total), 0);
      const totalOrders = ordersData.total || 0;
      const uniqueCustomers = new Set(orders.map((order: any) => order.customer_email)).size;

      // Calculate conversion rate (orders / customers * 100)
      const conversionRate = uniqueCustomers > 0 ? (totalOrders / uniqueCustomers) * 100 : 0;

      // Generate monthly sales data (simplified - in real app, you'd aggregate by month)
      const monthlySales = generateMonthlySalesData(orders);
      const monthlyCustomers = generateMonthlyCustomerData(orders);

      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers: uniqueCustomers,
        conversionRate: parseFloat(conversionRate.toFixed(1)),
        revenueChange: 0, // Would need historical data
        ordersChange: 0,
        customersChange: 0,
        conversionChange: 0,
      });

      setSalesData(monthlySales);
      setCustomerData(monthlyCustomers);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Generate monthly sales data from orders
  const generateMonthlySalesData = (orders: any[]): SalesData[] => {
    const monthlyData: { [key: string]: number } = {};

    orders.forEach(order => {
      const date = new Date(order.order_date);
      const monthKey = date.toLocaleString('default', { month: 'short' });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += parseFloat(order.total);
    });

    return Object.entries(monthlyData).map(([name, amount]) => ({
      name,
      amount: Math.round(amount),
    }));
  };

  // Generate monthly customer data from orders
  const generateMonthlyCustomerData = (orders: any[]): CustomerData[] => {
    const monthlyData: { [key: string]: Set<string> } = {};

    orders.forEach(order => {
      const date = new Date(order.order_date);
      const monthKey = date.toLocaleString('default', { month: 'short' });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = new Set();
      }
      monthlyData[monthKey].add(order.customer_email);
    });

    return Object.entries(monthlyData).map(([name, customers]) => ({
      name,
      count: customers.size,
    }));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-selta-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-600 font-semibold">Error loading dashboard</p>
            <p className="text-gray-600 mt-2">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-4 px-4 py-2 bg-selta-gold text-white rounded hover:bg-selta-gold/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
              <div className="text-2xl font-bold truncate">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange}% from last month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {stats.ordersChange >= 0 ? '+' : ''}{stats.ordersChange}% from last month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.customersChange >= 0 ? '+' : ''}{stats.customersChange}% from last month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.conversionChange >= 0 ? '+' : ''}{stats.conversionChange}% from last month
              </p>
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
                {salesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="amount" fill="#6e2594" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No sales data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {customerData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={customerData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Line type="monotone" dataKey="count" stroke="#deb945" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No customer data available</p>
                  </div>
                )}
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
            {recentOrders.length > 0 ? (
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
                          order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">${order.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent orders found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
