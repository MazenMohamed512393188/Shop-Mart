import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ShoppingBag, Tag, Award, Package } from "lucide-react";
import Link from "next/link";
import AddToCart from "@/components/AddToCart/AddToCart";
import AddToWishlist from "@/components/AddToWishlist/AddToWishlist";
import { Suspense } from "react";
import { ProductsApiResponse } from "@/interfaces/productInterface";

const formatCurrency = (amount: number, currency = "EGP", locale = "en-US") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

interface Params {
  brandId: string;
}

async function BrandInfo({ brandId }: { brandId: string }) {
  const response = await fetch(`${process.env.Base_Url}/brands/${brandId}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch brand details");
  }

  const { data: brandData } = await response.json();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 dark:from-slate-900 dark:to-slate-800/30">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
            {brandData.image && (
              <div className="relative">
                <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden border-4 border-background dark:border-slate-800 shadow-2xl">
                  <Image
                    src={brandData.image}
                    alt={brandData.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
              </div>
            )}
            
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground text-sm font-medium mb-6">
                <Award className="w-4 h-4" />
                Premium Brand
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                {brandData.name}
              </h1>
              {brandData.slug && (
                <p className="text-lg text-muted-foreground dark:text-slate-300 mb-8 leading-relaxed">
                  {brandData.slug}
                </p>
              )}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary dark:bg-slate-800/50">
                  <Package className="w-4 h-4" />
                  <span className="font-medium">Premium Quality</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary dark:bg-slate-800/50">
                  <Tag className="w-4 h-4" />
                  <span className="font-medium">Official Brand</span>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function BrandProducts({ brandId }: { brandId: string }) {
  const response = await fetch(
    `${process.env.Base_Url}/products?brand=${brandId}`,
    { next: { revalidate: 60 } }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: ProductsApiResponse = await response.json();

  if (!data.data || data.data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-6">📦</div>
          <h3 className="text-2xl font-bold mb-4">No Products Found</h3>
          <p className="text-muted-foreground mb-8">
            This brand doesn't have any products available at the moment.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Products by Brand</h2>
            <p className="text-muted-foreground">
              Discover our premium collection from {data.data[0]?.brand?.name}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {data.results || data.data.length} products
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.data.map((product) => (
              <Card key={product._id} className="group relative overflow-hidden border border-border dark:border-slate-700 hover:border-primary/50 hover:shadow-xl transition-all duration-300 h-full">
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                  {product.priceAfterDiscount && (
                    <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded">
                      SALE
                    </span>
                  )}
                </div>

                <Link href={`/products/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary to-accent/10">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent z-10" />
                    <Image
                      src={product.imageCover}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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
                </CardHeader>

                <CardContent className="pt-0">
                  <AddToCart productId={product.id}/>
                </CardContent>
              </Card>
          ))}
        </div>
    </div>
  );
}

function BrandInfoSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 dark:from-slate-900 dark:to-slate-800/30">
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
          <div className="w-full lg:w-2/5">
            <div className="h-64 lg:h-96 rounded-2xl bg-secondary dark:bg-slate-800/50 animate-pulse"></div>
          </div>
          <div className="flex-1 space-y-6">
            <div className="h-6 w-32 rounded-full bg-secondary dark:bg-slate-800/50 animate-pulse"></div>
            <div className="h-12 w-3/4 bg-secondary dark:bg-slate-800/50 rounded animate-pulse"></div>
            <div className="h-6 w-1/2 bg-secondary dark:bg-slate-800/50 rounded animate-pulse"></div>
            <div className="flex gap-4">
              <div className="h-10 w-32 bg-secondary dark:bg-slate-800/50 rounded animate-pulse"></div>
              <div className="h-10 w-32 bg-secondary dark:bg-slate-800/50 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-secondary dark:bg-slate-800/50 rounded animate-pulse"></div>
          <div className="h-4 w-32 bg-secondary dark:bg-slate-800/50 rounded animate-pulse"></div>
        </div>
        <div className="h-6 w-24 bg-secondary dark:bg-slate-800/50 rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-square bg-secondary dark:bg-slate-800/50 rounded-lg animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-secondary dark:bg-slate-800/50 rounded animate-pulse"></div>
              <div className="h-4 w-1/2 bg-secondary dark:bg-slate-800/50 rounded animate-pulse"></div>
              <div className="h-8 w-full bg-secondary dark:bg-slate-800/50 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function BrandDetailsPageModern({ params }: { params: Promise<Params> }) {
  const { brandId } = await params;

  return (
    <>
      <Suspense fallback={<BrandInfoSkeleton />}>
        <BrandInfo brandId={brandId} />
      </Suspense>

      <Suspense fallback={<ProductsSkeleton />}>
        <BrandProducts brandId={brandId} />
      </Suspense>
    </>
  );
}