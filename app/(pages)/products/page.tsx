import { ProductsApiResponse } from "@/interfaces/productInterface";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, StarHalf } from "lucide-react";
import Link from "next/link";
import AddToCart from "@/components/AddToCart/AddToCart";
import Loading from "@/components/Loading/Loading";
import { Suspense } from "react";
import AddToWishlist from "@/components/AddToWishlist/AddToWishlist";
const formatCurrency = (amount : number, currency = "EGP", locale = "en-US") => {
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
          <Card className="relative mx-auto w-full max-w-sm pt-0">
            <Link className="cursor-pointer" href={"/products/" + product.id}>
              <Image
                src={product.imageCover}
                alt={product.brand.name}
                width={1920}
                height={300}
                className="relative z-20 w-full h-60 object-cover"
              />
              <CardHeader>
                <span className="text-gray-300">{product.brand.slug}</span>
                <div className="flex justify-between">
                  <CardTitle className="line-clamp-1">
                    {product.title}
                  </CardTitle>
                </div>
                <CardDescription>{product.category.name}</CardDescription>
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
                <div className="flex">
                  <Star className="text-amber-400 fill-amber-400" />
                  <Star className="text-amber-400 fill-amber-400" />
                  <Star className="text-amber-400 fill-amber-400" />
                  <Star className="text-amber-400 fill-amber-400" />
                  <StarHalf className="text-amber-400 fill-amber-400" />
                </div>
                <p className="ml-2">{product.ratingsAverage}</p>
              </CardContent>
            </Link>
            <AddToCart productId={product.id} />
            <AddToWishlist productId={product.id} />
          </Card>
        </div>
      ))}
    </div>
  );
}

export default function products() {
  return (
    <Suspense fallback={<Loading />}>
      <ProductsList  />
    </Suspense>
  );
}
