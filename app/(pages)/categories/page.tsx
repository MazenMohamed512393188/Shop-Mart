import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Categories } from "@/interfaces/categoryInterface";
import { Grid3x3, ArrowRight } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/env";

export default async function CategoriesPage() {
  const categoriesUrl = API_ENDPOINTS.categories();
  const response = await fetch(categoriesUrl, {
    headers: {
      "content-type": "application/json",
    },
    next: { revalidate: 3600 }, // Revalidate every hour
  });
  
  const data = await response.json();
  const categories = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Grid3x3 className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Shop by Category
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our collection of premium products organized by category
        </p>
      </div>

      {/* Categories Count */}
      <div className="glass rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Grid3x3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Available Categories</p>
            <p className="text-2xl font-bold text-foreground">
              {categories.length}
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category: Categories) => (
            <Link
              key={category._id}
              href={`/categories/${category._id}`}
              className="group"
            >
              <div className="glass rounded-2xl overflow-hidden hover:shadow-glow transition-all duration-300 hover:-translate-y-2">
                {/* Category Image */}
                <div className="relative h-64 overflow-hidden bg-secondary">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Hover Icon */}
                  <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Category Name */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
            <Grid3x3 className="w-10 h-10 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No Categories Found
            </h2>
            <p className="text-muted-foreground">
              Categories will appear here once they are added
            </p>
          </div>
        </div>
      )}

      {/* Popular Categories Section (Optional) */}
      {categories.length > 0 && (
        <div className="glass rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Browse All Categories
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Find exactly what you're looking for
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.slice(0, 8).map((category: Categories) => (
              <Link
                key={category._id}
                href={`/categories/${category._id}`}
                className="group p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 text-center"
              >
                <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}