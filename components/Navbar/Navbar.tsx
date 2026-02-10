import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Package } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/actions/authOptions";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  
  // Fetch cart data only if session exists
  let cartItemsCount = 0;
  if (session?.token) {
    try {
      const response = await fetch(`${process.env.Base_Url}/cart`, {
        method: "GET",
        headers: {
          token: session.token as string,
          "Content-Type": "application/json",
        },
        cache: 'no-cache'
      });
      
      if (response.ok) {
        const data = await response.json();
        cartItemsCount = data?.numOfCartItems || 0;
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Package className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
              <div className="absolute -inset-1 bg-primary/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ShopMart
            </span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex gap-6">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/products"
                    className="text-sm font-medium text-foreground/80 hover:text-foreground dark:hover:text-accent transition-colors relative group py-2 dark:active:text-accent"
                  >
                    Products
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary hover:w-full transition-all duration-300" />
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                   <Link
                    href="/brands"
                    className="text-sm font-medium text-foreground/80 hover:text-foreground dark:hover:text-accent transition-colors relative group py-2 dark:active:text-accent"
                  >
                    Brands
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary hover:w-full transition-all duration-300" />
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/categories"
                    className="text-sm font-medium text-foreground/80 hover:text-foreground dark:hover:text-accent transition-colors relative group py-2 dark:active:text-accent"
                  >
                    Categories
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary hover:w-full transition-all duration-300" />
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <NavbarClient 
              hasSession={!!session} 
              cartItemsCount={cartItemsCount}
            />
          </div>
        </div>

        <div className="md:hidden pb-4">
          <NavigationMenu className="w-full">
            <NavigationMenuList className="flex gap-4 w-full justify-center">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/products"
                    className="text-sm font-medium text-foreground/80 hover:text-foreground"
                  >
                    Products
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/brands"
                    className="text-sm font-medium text-foreground/80 hover:text-foreground"
                  >
                    Brands
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/categories"
                    className="text-sm font-medium text-foreground/80 hover:text-foreground"
                  >
                    Categories
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}