import { ProductsApiResponse } from "@/interfaces/productInterface";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import Link from "next/link";
import AddToCart from "@/components/AddToCart/AddToCart";
import Loading from "@/components/Loading/Loading";
import { Suspense } from "react";
import AddToWishlist from "@/components/AddToWishlist/AddToWishlist";
const formatCurrency = (amount: number, currency = "EGP", locale = "en-US") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};
async function ProductsList() {
  const response = await fetch(`${process.env.Base_Url}/products`);
  const data: ProductsApiResponse = await response.json();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.data.map((product) => (
        <div className="p-2" key={product.id}>
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
                <AddToWishlist productId={product.id} />
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
              <AddToCart productId={product.id} />
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

export default function products() {
  return (
    <Suspense fallback={<Loading />}>
      <ProductsList />
    </Suspense>
  );
}
