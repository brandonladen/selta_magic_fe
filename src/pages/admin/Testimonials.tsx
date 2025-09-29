import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Star, 
  Check, 
  X, 
  Eye, 
  Trash2, 
  Edit, 
  MessageSquare, 
  Users, 
  TrendingUp,
  Clock,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useAdminTestimonials } from '@/hooks/useTestimonials';
import { useToast } from '@/hooks/use-toast';
import { Testimonial } from '@/types/testimonial';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminTestimonials() {
  console.log('AdminTestimonials component rendering...');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Testimonial>>({});
  const [componentError, setComponentError] = useState<string | null>(null);

  // Memoize filters to prevent infinite re-renders
  const filters = useMemo(() => ({
    isApproved: statusFilter === 'all' ? undefined : statusFilter === 'approved',
    rating: ratingFilter && ratingFilter !== 'all' ? parseInt(ratingFilter) : undefined,
    sortBy: 'newest' as const,
  }), [statusFilter, ratingFilter]);
  
  console.log('AdminTestimonials filters:', filters);

  const [stats, setStats] = useState<any>({
    total: 0,
    approved: 0,
    pending: 0,
    averageRating: 0,
    ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });

  let testimonials: Testimonial[] = [];
  let loading = true;
  let approveTestimonial: any;
  let deleteTestimonial: any;
  let updateTestimonial: any;
  let getStats: any;
  
  try {
    console.log('Calling useAdminTestimonials hook...');
    const hookResult = useAdminTestimonials(filters);
    console.log('useAdminTestimonials result:', hookResult);
    
    testimonials = hookResult.testimonials;
    loading = hookResult.loading;
    approveTestimonial = hookResult.approveTestimonial;
    deleteTestimonial = hookResult.deleteTestimonial;
    updateTestimonial = hookResult.updateTestimonial;
    getStats = hookResult.getStats;
  } catch (error) {
    console.error('Error in useAdminTestimonials:', error);
    setComponentError(`Hook error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Load stats when component mounts or testimonials change
  useEffect(() => {
    const loadStats = async () => {
      try {
        console.log('Loading stats...');
        const statsResult = await getStats();
        console.log('Stats result:', statsResult);
        setStats(statsResult);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    if (getStats && !loading) {
      loadStats();
    }
  }, [getStats, loading, testimonials]);
  
  const { toast } = useToast();

  let filteredTestimonials: Testimonial[] = [];
  
  try {
    console.log('Filtering testimonials. Total testimonials:', testimonials?.length || 0);
    console.log('Search term:', searchTerm);
    
    filteredTestimonials = testimonials?.filter(testimonial => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        testimonial.customerName.toLowerCase().includes(searchLower) ||
        testimonial.title.toLowerCase().includes(searchLower) ||
        testimonial.message.toLowerCase().includes(searchLower) ||
        testimonial.customerEmail.toLowerCase().includes(searchLower)
      );
    }) || [];
    
    console.log('Filtered testimonials count:', filteredTestimonials.length);
  } catch (error) {
    console.error('Error filtering testimonials:', error);
    filteredTestimonials = [];
  }

  const handleApprove = async (id: string) => {
    try {
      console.log('Approving testimonial:', id);
      await approveTestimonial(id);
      console.log('Testimonial approved successfully');
      toast({
        title: "Success",
        description: "Testimonial approved successfully",
      });
    } catch (error) {
      console.error('Error approving testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to approve testimonial",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('Deleting testimonial:', id);
      await deleteTestimonial(id);
      console.log('Testimonial deleted successfully');
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setEditForm({
      customerName: testimonial.customerName,
      title: testimonial.title,
      message: testimonial.message,
      rating: testimonial.rating,
      isApproved: testimonial.isApproved,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedTestimonial) return;

    try {
      console.log('Updating testimonial:', selectedTestimonial.id, editForm);
      await updateTestimonial(selectedTestimonial.id, editForm);
      console.log('Testimonial updated successfully');
      setIsEditDialogOpen(false);
      setSelectedTestimonial(null);
      setEditForm({});
      toast({
        title: "Success",
        description: "Testimonial updated successfully",
      });
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to update testimonial",
        variant: "destructive",
      });
    }
  };

  const handleView = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsViewDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Add component lifecycle logging
  useEffect(() => {
    console.log('AdminTestimonials component mounted');
    return () => {
      console.log('AdminTestimonials component unmounting');
    };
  }, []);
  
  useEffect(() => {
    console.log('AdminTestimonials state changed:', {
      loading,
      testimonialsCount: testimonials?.length || 0,
      componentError,
      stats
    });
  }, [loading, testimonials, componentError, stats]);
  
  // Show component error if any
  if (componentError) {
    console.error('Component error detected:', componentError);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 text-lg font-semibold mb-2">Component Error</h2>
          <p className="text-red-700">{componentError}</p>
          <button 
            onClick={() => {
              console.log('Retrying component...');
              setComponentError(null);
              window.location.reload();
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  if (loading) {
    console.log('Showing loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-selta-deep-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Loading testimonials...</p>
          <p className="text-sm text-gray-500 mt-2">Check console for debugging info</p>
        </div>
      </div>
    );
  }

  console.log('Rendering AdminTestimonials main content');
  
  return (
    <AdminLayout title="Testimonial Management">
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-gray-600">Manage customer reviews and testimonials</p>
            <div className="mt-1 text-sm text-gray-500">
              {testimonials?.length || 0} testimonials loaded, {filteredTestimonials?.length || 0} after filtering
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Check className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.approved || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.pending || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.averageRating?.toFixed(1) || '0.0'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setRatingFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials Table */}
        <Card>
          <CardHeader>
            <CardTitle>Testimonials ({filteredTestimonials.length})</CardTitle>
            <CardDescription>
              Manage and moderate customer testimonials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {filteredTestimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{testimonial.customerName}</p>
                        <p className="text-sm text-gray-500">{testimonial.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm">({testimonial.rating})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium truncate max-w-[200px]">
                        {testimonial.title || 'No title'}
                      </p>
                    </TableCell>
                    <TableCell>
                      {testimonial.productName ? (
                        <Badge variant="secondary">{testimonial.productName}</Badge>
                      ) : (
                        <span className="text-gray-500">General</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={testimonial.isApproved ? "default" : "secondary"}>
                        {testimonial.isApproved ? 'Approved' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(testimonial.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(testimonial)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(testimonial)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!testimonial.isApproved && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(testimonial.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(testimonial.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                </TableBody>
              </Table>
            </div>

            {filteredTestimonials.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No testimonials found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>View Testimonial</DialogTitle>
              <DialogDescription>
                Full testimonial details
              </DialogDescription>
            </DialogHeader>
          {selectedTestimonial && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer Name</Label>
                  <p className="font-medium">{selectedTestimonial.customerName}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-gray-600">{selectedTestimonial.customerEmail}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Rating</Label>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < selectedTestimonial.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2">({selectedTestimonial.rating}/5)</span>
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant={selectedTestimonial.isApproved ? "default" : "secondary"}>
                    {selectedTestimonial.isApproved ? 'Approved' : 'Pending'}
                  </Badge>
                </div>
              </div>

              {selectedTestimonial.title && (
                <div>
                  <Label>Title</Label>
                  <p className="font-medium">{selectedTestimonial.title}</p>
                </div>
              )}

              <div>
                <Label>Message</Label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {selectedTestimonial.message}
                </p>
              </div>

              {selectedTestimonial.productName && (
                <div>
                  <Label>Product</Label>
                  <Badge variant="secondary">{selectedTestimonial.productName}</Badge>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <Label>Created</Label>
                  <p>{formatDate(selectedTestimonial.createdAt)}</p>
                </div>
                <div>
                  <Label>Updated</Label>
                  <p>{formatDate(selectedTestimonial.updatedAt)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Testimonial</DialogTitle>
              <DialogDescription>
                Modify testimonial details
              </DialogDescription>
            </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Customer Name</Label>
              <Input
                id="edit-name"
                value={editForm.customerName || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, customerName: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="edit-message">Message</Label>
              <Textarea
                id="edit-message"
                value={editForm.message || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-rating">Rating</Label>
                <Select 
                  value={editForm.rating?.toString() || '5'} 
                  onValueChange={(value) => setEditForm(prev => ({ ...prev, rating: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={editForm.isApproved ? 'approved' : 'pending'} 
                  onValueChange={(value) => setEditForm(prev => ({ ...prev, isApproved: value === 'approved' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
