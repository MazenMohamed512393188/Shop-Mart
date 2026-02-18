"use client";
import { ProductsApiResponse } from "@/interfaces/productInterface";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";
import AddToCart from "@/components/AddToCart/AddToCart";
import AddToWishlist from "@/components/AddToWishlist/AddToWishlist";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Wishlist } from "@/interfaces/wishlistInterface";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

const formatCurrency = (amount: number, currency = "EGP", locale = "en-US") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Optimized skeleton with shimmer effect
const ProductSkeleton = () => (
  <div className="p-2">
    <Card className="h-full overflow-hidden">
      <div className="relative aspect-square bg-linear-to-br from-muted/50 to-muted animate-pulse">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>
      <CardHeader className="pb-4 space-y-3">
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted/70 rounded w-2/3 animate-pulse" />
        </div>
        <div className="h-6 bg-muted rounded w-1/2 animate-pulse" />
        <div className="h-4 bg-muted/70 rounded w-1/3 animate-pulse" />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-10 bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  </div>
);

// Error boundary fallback
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="min-h-[60vh] flex items-center justify-center p-4">
    <div className="text-center max-w-md mx-auto p-8 space-y-6">
      <div className="relative mx-auto w-24 h-24">
        <div className="absolute inset-0 bg-destructive/10 rounded-full animate-ping" />
        <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-destructive/20 to-destructive/5 flex items-center justify-center border-2 border-destructive/20">
          <RefreshCw className="w-12 h-12 text-destructive" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Connection Lost
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          We couldn't load the products. Please check your internet connection and try again.
        </p>
      </div>
      
      <Button 
        onClick={onRetry}
        size="lg"
        className="gap-2 min-w-35 shadow-lg hover:shadow-xl transition-shadow"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </Button>
    </div>
  </div>
);

// Empty state
const EmptyState = () => (
  <div className="min-h-[40vh] flex items-center justify-center p-4">
    <div className="text-center max-w-md mx-auto space-y-4">
      <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
        <Star className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground">No Products Found</h3>
      <p className="text-muted-foreground">
        We couldn't find any products at the moment. Please try again later.
      </p>
    </div>
  </div>
);

export default function Products() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<ProductsApiResponse | null>(null);
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page) : 1;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPageChanging, setIsPageChanging] = useState(false);

  // Detect mobile with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const checkMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 100);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timeoutId);
    };
  }, []);

  // Fetch data with retry logic
  const fetchData = async (page: number = 1, retryAttempt: number = 0) => {
    const MAX_RETRIES = 2;
    setIsLoading(true);
    setError(null);

    try {
      const itemsPerPage = isMobile ? 6 : 20;
      
      // Create abort controller with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const productsPromise = fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/products?page=${page}&limit=${itemsPerPage}`,
        { signal: controller.signal }
      );

      const wishlistPromise = session?.token
        ? fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist`, {
            headers: {
              token: session.token as string,
              "Content-Type": "application/json",
            },
          })
            .then(res => res.ok ? res.json() : { data: [] })
            .catch(() => ({ data: [] }))
        : Promise.resolve({ data: [] });

      const [productsResponse, wishlistData] = await Promise.all([
        productsPromise,
        wishlistPromise
      ]);

      clearTimeout(timeoutId);

      if (!productsResponse.ok) {
        throw new Error(`HTTP Error: ${productsResponse.status}`);
      }

      const productsData: ProductsApiResponse = await productsResponse.json();
      
      if (!productsData.data || productsData.data.length === 0) {
        setProducts({ ...productsData, data: [] });
      } else {
        setProducts(productsData);
      }
      
      const wishlistIds: string[] = wishlistData.data?.map(
        (item: Wishlist) => item.id || item._id
      ) || [];
      setWishlistProductIds(wishlistIds);

    } catch (err) {
      console.error('Fetch error:', err);
      
      // Check if it's an abort error (timeout)
      const isTimeout = err instanceof Error && err.name === 'AbortError';
      
      // Retry logic
      if (retryAttempt < MAX_RETRIES) {
        const retryMessage = isTimeout 
          ? `Connection timeout. Retrying... (${retryAttempt + 1}/${MAX_RETRIES})`
          : `Retrying... (${retryAttempt + 1}/${MAX_RETRIES})`;
        
        toast.loading(retryMessage, {
          duration: 1500,
          id: 'retry-toast'
        });
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryAttempt + 1)));
        return fetchData(page, retryAttempt + 1);
      }
      
      // Max retries reached
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      
      toast.dismiss('retry-toast');
      toast.error('Unable to load products. Please check your connection and try again.', {
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
      setIsPageChanging(false);
    }
  };

  // Initial load and page changes
  useEffect(() => {
    fetchData(currentPage, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, session?.token, isMobile]);

  const handleRetry = () => {
    fetchData(currentPage, 0);
  };

  const handlePageChange = (newPage: number) => {
    setIsPageChanging(true);
    setCurrentPage(newPage);
    
    // Update URL without page reload
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
    
    // Smooth scroll to top
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };

  // Error state
  if (error && !isLoading) {
    return <ErrorState onRetry={handleRetry} />;
  }

  // Loading state
  if (isLoading || !products) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(isMobile ? 6 : 8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const { data: productsList, metadata } = products;
  const totalPages = metadata?.numberOfPages || 1;

  // Empty state
  if (productsList.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-8">
      {/* Loading overlay for page transitions */}
      {isPageChanging && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg shadow-lg flex items-center gap-3 border border-border">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm font-medium">Loading products...</span>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {productsList.map((product, index) => {
          const isInWishlist = wishlistProductIds.includes(product.id);
          
          return (
            <div 
              className="p-2" 
              key={product.id}
              style={{
                animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`
              }}
            >
              <Card className="group relative overflow-hidden border border-border dark:border-slate-700 hover:border-primary/50 hover:shadow-xl transition-all duration-300 h-full">
                <Link href={`/products/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-linear-to-br from-secondary to-accent/10">
                    <div className="absolute inset-0 bg-linear-to-t from-background/30 via-transparent to-transparent z-10" />
                    <Image
                      src={product.imageCover}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      loading={index < 4 ? "eager" : "lazy"}
                      priority={index < 4}
                    />
                  </div>
                </Link>

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <Link href={`/products/${product.id}`}>
                        <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors mb-1">
                          {product.title}
                        </CardTitle>
                      </Link>
                      <CardDescription className="line-clamp-1">
                        {product.category?.name}
                      </CardDescription>
                    </div>
                    <AddToWishlist 
                      productId={product.id} 
                      isInWishlist={isInWishlist}
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    {product.priceAfterDiscount ? (
                      <>
                        <span className="text-lg font-bold text-foreground">
                          {formatCurrency(product.priceAfterDiscount)}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          {formatCurrency(product.price)}
                        </span>
                        <span className="ml-auto text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded">
                          {Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-foreground">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 transition-colors ${
                            i < Math.floor(product.ratingsAverage || 0)
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.ratingsAverage?.toFixed(1) || "0.0"})
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <AddToCart productId={product.id} />
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Enhanced Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isPageChanging}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              {!isMobile && "Previous"}
            </Button>

            <div className="flex items-center gap-1">
              {/* First page */}
              {currentPage > 3 && (
                <>
                  <Button
                    variant="ghost"
                    size={isMobile ? "sm" : "default"}
                    onClick={() => handlePageChange(1)}
                    disabled={isPageChanging}
                    className="min-w-10"
                  >
                    1
                  </Button>
                  {currentPage > 4 && (
                    <span className="px-2 text-muted-foreground">...</span>
                  )}
                </>
              )}

              {/* Pages around current */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                const showPage = 
                  pageNum === currentPage ||
                  (pageNum >= currentPage - 2 && pageNum <= currentPage + 2);

                if (!showPage) return null;

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "ghost"}
                    size={isMobile ? "sm" : "default"}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isPageChanging}
                    className={`min-w-10 ${
                      pageNum === currentPage 
                        ? "shadow-md" 
                        : ""
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              {/* Last page */}
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <span className="px-2 text-muted-foreground">...</span>
                  )}
                  <Button
                    variant="ghost"
                    size={isMobile ? "sm" : "default"}
                    onClick={() => handlePageChange(totalPages)}
                    disabled={isPageChanging}
                    className="min-w-10"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isPageChanging}
              className="gap-1"
            >
              {!isMobile && "Next"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Results info */}
          <div className="text-center text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{currentPage}</span> of{" "}
            <span className="font-medium text-foreground">{totalPages}</span> pages
            {metadata && (
              <span className="hidden sm:inline">
                {" "}· {products.results} total products
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}