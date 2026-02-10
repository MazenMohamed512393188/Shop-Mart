import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/interfaces/productInterface";
import { Star, StarHalf } from "lucide-react";
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
  const { data: Product }: { data: Product } = await response.json();
  return (
    <>
      <Card className="grid grid-cols-1 md:grid-cols-3 items-center mx-auto w-full px-8">
        <div className="col-span-1 w-full h-full p-4">
          <Carousel>
            <CarouselContent>
              {Product.images.map((img) => (
                <CarouselItem key={img}>
                  <Image
                    src={img}
                    alt={Product.title}
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
            <span className="text-gray-300">{Product.brand.slug}</span>
            <div className="flex justify-between">
              <CardTitle className="line-clamp-1">{Product.title}</CardTitle>
            </div>
            <CardDescription>{Product.category.name}</CardDescription>
            <CardDescription>{Product.description}</CardDescription>
            {Product.priceAfterDiscount ? (
              <div className="mt-2">
                <span className="text-sm text-gray-500 line-through mr-2">
                  {Product.price}EGP
                </span>
                <span className="text-sm font-semibold">
                  {Product.priceAfterDiscount}EGP
                </span>
              </div>
            ) : (
              <div className="mt-2">
                <span className="text-sm font-semibold">
                  {formatCurrency(Product.price)}
                </span>
              </div>
            )}
          </CardHeader>
          <CardContent className="flex gap-2">
            <div className="flex">
              <Star className="text-amber-400 fill-amber-400" />
              <Star className="text-amber-400 fill-amber-400" />
              <Star className="text-amber-400 fill-amber-400" />
              <Star className="text-amber-400 fill-amber-400" />
              <StarHalf className="text-amber-400 fill-amber-400" />
            </div>
            <p className="ml-2">{Product.ratingsAverage}</p>
          </CardContent>
          <AddToCart productId={Product.id} />
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
