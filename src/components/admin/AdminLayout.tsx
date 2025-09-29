
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Users, MapPin, MessageCircle, FolderTree, Images, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import Logo from "@/components/shared/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if not logged in or not an admin
  if (!user) {
    navigate("/login");
    return null;
  }
  
  if (!isAdmin) {
    toast({
      title: "Access denied",
      description: "You don't have permission to access the admin area",
      variant: "destructive",
    });
    navigate("/");
    return null;
  }
  
  const navigationItems = [
    { path: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: "/admin/products", label: "Products", icon: <ShoppingBag className="h-5 w-5" /> },
    { path: "/admin/categories", label: "Categories", icon: <FolderTree className="h-5 w-5" /> },
    { path: "/admin/carousel", label: "Carousel", icon: <Images className="h-5 w-5" /> },
    { path: "/admin/testimonials", label: "Testimonials", icon: <Star className="h-5 w-5" /> },
    { path: "/admin/users", label: "Users", icon: <Users className="h-5 w-5" /> },
    { path: "/admin/delivery", label: "Delivery", icon: <MapPin className="h-5 w-5" /> },
    { path: "/admin/chats", label: "Customer Chats", icon: <MessageCircle className="h-5 w-5" /> },
  ];
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="h-screen bg-gray-100 flex w-full overflow-hidden relative">
        {/* Sidebar with fixed positioning and higher z-index */}
        <div className="z-30 h-screen sticky top-0 left-0 admin-sidebar">
          <Sidebar>
            <SidebarHeader className="p-4">
              <div className="flex items-center gap-2">
                <Logo className="w-10 h-10" />
                <h2 className="text-lg font-bold text-selta-deep-purple">Admin Panel</h2>
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton 
                          asChild
                          isActive={location.pathname === item.path}
                          tooltip={item.label}
                        >
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => navigate(item.path)}
                          >
                            {item.icon}
                            <span className="ml-2">{item.label}</span>
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter className="border-t mt-auto p-4">
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('/', '_blank')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <span className="ml-2">View Website</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={async () => {
                    try {
                      await logout();
                      navigate('/login');
                    } catch (error) {
                      console.error('Logout failed:', error);
                      toast({
                        title: "Logout Error",
                        description: "Failed to log out. Please try again.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span className="ml-2">Logout</span>
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
        </div>
        
        {/* Main content area with proper overflow handling and z-index */}
        <main className="flex-1 z-20 overflow-auto admin-content">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-selta-deep-purple">{title}</h1>
            </div>
            
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
