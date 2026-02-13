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
const formatCurrency = (amount : number, currency = "EGP", locale = "en-US") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};
async function ProductDetails({ params }: { params: Params }) {
  const { productId } = await params;
  const response = await fetch(
    `${process.env.Base_Url}/products/${productId}`,
  );
  const { data: product }: { data: Product } = await response.json();
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
              <div className="mt-2">
                <span className="text-sm text-gray-500 line-through mr-2">
                  {product.price}EGP
                </span>
                <span className="text-sm font-semibold">
                  {product.priceAfterDiscount}EGP
                </span>
              </div>
            ) : (
              <div className="mt-2">
                <span className="text-sm font-semibold">
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
}

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<Loading />}>
      <ProductDetails params={params} />
    </Suspense>
  );
}
