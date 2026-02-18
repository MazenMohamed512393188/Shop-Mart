import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/interfaces/productInterface";
import { Star } from "lucide-react";
import { Params } from "next/dist/server/request/params";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AddToCart from "@/components/AddToCart/AddToCart";
import { Suspense } from "react";
import Loading from "@/components/Loading/Loading";
import { API_ENDPOINTS } from "@/lib/env";
import { notFound } from "next/navigation";

const formatCurrency = (amount: number, currency = "EGP", locale = "en-US") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

async function ProductDetails({ params }: { params: Params }) {
  const { productId } = await params;
  
  try {
    // Use centralized API endpoint
    const productUrl = API_ENDPOINTS.productDetails(productId);
    
    const response = await fetch(productUrl, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    // Handle 404 - Product not found
    if (response.status === 404) {
      notFound();
    }

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const { data: product }: { data: Product } = await response.json();

    // Additional validation
    if (!product || !product.id) {
      notFound();
    }

    return (
      <>
        <Card className="grid grid-cols-1 md:grid-cols-3 items-center mx-auto w-full px-8">
          <div className="col-span-1 w-full h-full p-4">
            <Carousel>
              <CarouselContent>
                {product.images.map((img) => (
                  <CarouselItem key={img}>
                    <Image
                      src={img}
                      alt={product.title}
                      width={1920}
                      height={300}
                      className="w-full object-cover"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          
          <div className="col-span-2 p-4 space-y-4">
            <CardHeader>
              <span className="text-gray-300">{product.brand.slug}</span>
              <div className="flex justify-between">
                <CardTitle className="line-clamp-1">{product.title}</CardTitle>
              </div>
              <CardDescription>{product.category.name}</CardDescription>
              <CardDescription>{product.description}</CardDescription>
              
              {product.priceAfterDiscount ? (
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-lg font-semibold text-foreground">
                    {formatCurrency(product.priceAfterDiscount)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded">
                    {Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <div className="mt-2">
                  <span className="text-lg font-semibold text-foreground">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="flex gap-2">
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.ratingsAverage || 0)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.ratingsAverage?.toFixed(1) || "0.0"})
                </span>
              </div>
            </CardContent>
            
            <AddToCart productId={product.id} />
          </div>
        </Card>
      </>
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    
    // Show error page
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            Unable to Load Product
          </h2>
          <p className="text-muted-foreground">
            We couldn't load this product. Please try again later or go back to the products page.
          </p>
        </div>
      </div>
    );
  }
}

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<Loading />}>
      <ProductDetails params={params} />
    </Suspense>
  );
}