"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, User, Package } from "lucide-react";
import Logout from "@/app/(pages)/login/logout/LogOut";

interface NavbarClientProps {
  hasSession: boolean;
  cartItemsCount: number;
}

export default function NavbarClient({ hasSession, cartItemsCount }: NavbarClientProps) {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use client-side session status for accurate state
  const isAuthenticated = mounted ? !!session : hasSession;
  const cartCount = mounted ? (session ? cartItemsCount : 0) : cartItemsCount;

  if (!mounted) {
    // Return server-rendered version to prevent hydration mismatch
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative w-10 h-10 rounded-lg bg-secondary hover:bg-accent/10 transition-colors duration-300 flex items-center justify-center">
              <User className="h-5 w-5 text-foreground" />
              {hasSession && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {hasSession ? "My Account" : "Guest"}
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>

        {hasSession && (
          <Link href="/cart-page" aria-label="Shopping cart">
            <button className="relative w-10 h-10 rounded-lg bg-secondary hover:bg-accent/10 transition-colors duration-300 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-foreground" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            </button>
          </Link>
        )}
      </>
    );
  }

  return (
    <>
      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative w-10 h-10 rounded-lg bg-secondary hover:bg-accent/10 transition-colors duration-300 flex items-center justify-center group">
            <User className="h-5 w-5 text-foreground" />
            {isAuthenticated && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">
                {isAuthenticated ? "My Account" : "Guest"}
              </p>
              {isAuthenticated && (
                <p className="text-xs text-muted-foreground">Welcome back!</p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {isAuthenticated ? (
            <>
              <DropdownMenuGroup>
                <Link href="/profile-page">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <Link href="/allorders">
                  <DropdownMenuItem className="cursor-pointer">
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </DropdownMenuItem>
                </Link>
                <Link href="/wishlist-page">
                  <DropdownMenuItem className="cursor-pointer">
                    ❤️ My Wishlist
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <Logout />
            </>
          ) : (
            <DropdownMenuGroup>
              <Link href="/login">
                <DropdownMenuItem className="cursor-pointer">
                  Login
                </DropdownMenuItem>
              </Link>
              <Link href="/register">
                <DropdownMenuItem className="cursor-pointer">
                  Register
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Shopping Cart - Only show when authenticated */}
      {isAuthenticated && (
        <Link href="/cart-page" aria-label="Shopping cart">
          <button className="relative w-10 h-10 rounded-lg bg-secondary hover:bg-accent/10 transition-colors duration-300 flex items-center justify-center group">
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </Link>
      )}
    </>
  );
}
