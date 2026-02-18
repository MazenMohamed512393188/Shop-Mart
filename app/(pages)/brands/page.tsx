import { Brands } from "@/interfaces/brandInterface";
import { API_ENDPOINTS } from "@/lib/env";
import Image from "next/image";
import Link from "next/link";

export default async function BrandsModern() {
  const brandsUrl = API_ENDPOINTS.brands();
  const response = await fetch(brandsUrl, {
    headers: {
      "content-type": "application/json",
    },
    next: { revalidate: 60 },
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch brands");
  }
  
  const data = await response.json();
  const brands: Brands[] = data.data || [];

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary/30 dark:from-slate-900 dark:to-slate-800/30">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-accent/10 to-primary/10" />
        <div className="container mx-auto px-4 py-24 relative">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-linear-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Brands
            </h1>
            <p className="text-xl text-muted-foreground dark:text-slate-300 leading-relaxed">
              Discover our collection of premium brands that define excellence and style.
            </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 pb-24">
        {brands.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🏷️</div>
            <h3 className="text-2xl font-bold mb-4">No Brands Available</h3>
            <p className="text-muted-foreground">Check back soon for our premium brand collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {brands.map((brand) => (
                <div key={brand._id}>
                  <Link href={`/brands/${brand._id}`}>
                  <div className="group relative bg-card dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-border dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:border-primary/50 transition-all duration-300 h-full">
                    <div className="relative h-48 overflow-hidden bg-linear-to-br from-secondary to-accent/10">
                      <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent z-10" />
                      {brand.image ? (
                        <Image
                          src={brand.image}
                          alt={brand.name}
                          fill
                          className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-6xl">🏷️</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 text-center relative z-20">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-1">
                        {brand.name}
                      </h3>
                      {brand.slug && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {brand.slug}
                        </p>
                      )}
                      <div className="flex items-center justify-center gap-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          View Products
                        </span>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-linear-to-tr from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
                </div>
            ))}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 pb-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Looking for Something Specific?</h2>
          <p className="text-muted-foreground dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Contact our brand specialists for personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              Browse All Products
            </Link>
          </div>
      </div>
    </div>
  );
}