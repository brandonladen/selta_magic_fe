
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { usersService, User } from '@/services/usersService';

const AdminUsers = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      navigate('/login');
      toast.error('You must be an admin to access this page');
      return;
    }

    // Fetch users from API
    fetchUsers();
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersService.getUsers();
      setUsers(response.users);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      await usersService.updateUserRole(userId, newRole);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      // Update selected user if it's the one being changed
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
      
      toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      console.error('Error updating user role:', err);
      toast.error('Failed to update user role');
    }
  };

  const handleStatusChange = (userId: string, newStatus: 'active' | 'inactive') => {
    // For now, just update local state since we don't have status in the backend yet
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    
    // Update selected user if it's the one being changed
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, status: newStatus });
    }
    
    toast.success(`User status updated to ${newStatus}`);
  };

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <AdminLayout title="Manage Users">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Manage Users">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchUsers} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <AdminLayout title="Manage Users">
      <Helmet>
        <title>Admin - Manage Users</title>
      </Helmet>
      
      <div className="container mx-auto px-0">
        <h1 className="text-2xl font-bold mb-6">
          Manage Users ({users.length} {users.length === 1 ? 'user' : 'users'})
        </h1>
        
        <Card>
          <CardContent className="p-0 overflow-auto">
            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{usersService.formatDate(user.lastLogin)}</TableCell>
                      <TableCell className="whitespace-nowrap">{user.ordersCount}</TableCell>
                      <TableCell className="whitespace-nowrap">{usersService.formatCurrency(user.totalSpent)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => viewUserDetails(user)}
                          >
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">First Name</p>
                    <p>{selectedUser.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Name</p>
                    <p>{selectedUser.lastName}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{selectedUser.email}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={selectedUser.role === 'admin' ? 'default' : 'outline'}>
                        {selectedUser.role}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRoleChange(
                          selectedUser.id, 
                          selectedUser.role === 'admin' ? 'user' : 'admin'
                        )}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={selectedUser.status === 'active' ? 'default' : 'secondary'}>
                        {selectedUser.status}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleStatusChange(
                          selectedUser.id, 
                          selectedUser.status === 'active' ? 'inactive' : 'active'
                        )}
                      >
                        Toggle
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Activity</p>
                    <p>{usersService.formatDate(selectedUser.lastLogin)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                    <p>{selectedUser.ordersCount}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Spent</p>
                    <p className="font-semibold text-green-600">{usersService.formatCurrency(selectedUser.totalSpent)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Member Since</p>
                    <p>{usersService.formatDate(selectedUser.createdAt)}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
