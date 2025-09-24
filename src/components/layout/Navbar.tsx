
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, X, ShoppingCart, User, Package, LogOut } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const { cartItems } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={cn("bg-white border-b sticky top-0 z-50 w-full", className)}>
      <div className="container max-w-screen-2xl mx-auto py-2 px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo className="h-10 md:h-12" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={cn("text-sm font-medium transition-colors hover:text-gray-600", location.pathname === "/" ? "text-gray-900" : "text-gray-500")}>
              Home
            </Link>
            <Link to="/products" className={cn("text-sm font-medium transition-colors hover:text-gray-600", location.pathname === "/products" ? "text-gray-900" : "text-gray-500")}>
              Products
            </Link>
            {user && (
              <Link to="/orders" className={cn("text-sm font-medium transition-colors hover:text-gray-600", location.pathname === "/orders" ? "text-gray-900" : "text-gray-500")}>
                My Orders
              </Link>
            )}
            <Link to="/about" className={cn("text-sm font-medium transition-colors hover:text-gray-600", location.pathname === "/about" ? "text-gray-900" : "text-gray-500")}>
              About
            </Link>
            <Link to="/testimonials" className={cn("text-sm font-medium transition-colors hover:text-gray-600", location.pathname === "/testimonials" ? "text-gray-900" : "text-gray-500")}>
              Reviews
            </Link>
            <Link to="/contact" className={cn("text-sm font-medium transition-colors hover:text-gray-600", location.pathname === "/contact" ? "text-gray-900" : "text-gray-500")}>
              Contact
            </Link>
            {isAdmin && (
              <Link to="/admin" className={cn("text-sm font-medium transition-colors hover:text-gray-600", location.pathname === "/admin" ? "text-gray-900" : "text-gray-500")}>
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Link with Item Count */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-gray-700">
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-selta-gold text-selta-deep-purple h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </Link>
            
            {user ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden md:inline-block">
                        {user.firstName}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-red-600">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" onClick={toggleMenu}>
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="sm:max-w-sm">
                <SheetHeader className="space-y-2 text-left">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Explore our site and discover something new.
                  </SheetDescription>
                </SheetHeader>
                <nav className="grid gap-4 py-4">
                  <Link to="/" className={cn("text-sm font-medium transition-colors hover:text-gray-600", location.pathname === "/" ? "text-gray-900" : "text-gray-500")} onClick={closeMenu}>
                    Home
                  </Link>
                  <Link to="/products" className={cn("text-sm font-medium transition-colors hover:text-gray-600", location.pathname === "/products" ? "text-gray-900" : "text-gray-500")} onClick={closeMenu}>
                    Products
                  </Link>
                  {user && (
                    <Link to="/orders" className={cn("text-sm font-medium transition-colors hover:text-gray-600", location.pathname === "/orders" ? "text-gray-900" : "text-gray-500")} onClick={closeMenu}>
                      My Orders
                    </Link>
                  )}
                  <Link to="/about" className={cn("text-sm font-medium transition-colors hover:text-gray-600", location.pathname === "/about" ? "text-gray-900" : "text-gray-500")} onClick={closeMenu}>
                    About
                  </Link>
                  <Link to="/testimonials" className={cn("text-sm font-medium transition-colors hover:text-gray-600", location.pathname === "/testimonials" ? "text-gray-900" : "text-gray-500")} onClick={closeMenu}>
                    Reviews
                  </Link>
                  <Link to="/contact" className={cn("text-sm font-medium transition-colors hover:text-gray-600", location.pathname === "/contact" ? "text-gray-900" : "text-gray-500")} onClick={closeMenu}>
                    Contact
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className={cn("text-sm font-medium transition-colors hover:text-gray-600", location.pathname === "/admin" ? "text-gray-900" : "text-gray-500")} onClick={closeMenu}>
                      Admin Panel
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
