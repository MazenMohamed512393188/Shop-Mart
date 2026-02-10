export default function Blog() {
  return (
    <div className="bg-white text-black">
      <div className="max-w-6xl mx-auto px-8 py-24">
        <div className="text-center mb-20 animate-fadeInUp">
          <div className="text-xs tracking-widest uppercase mb-4 font-medium text-gray-800">
            STORIES & INSPIRATION
          </div>
          <h1 className="font-serif text-7xl font-black tracking-tight mb-8">
            Blog
          </h1>
          <p className="text-xl text-gray-800 max-w-2xl mx-auto leading-relaxed">
            Discover style tips, sustainability insights, and the stories behind our collections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32 bg-gray-100 p-16">
          <div className="h-[500px] bg-gray-200 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop"
              alt="Featured Post"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="py-8">
            <span className="bg-black text-white px-4 py-2 text-xs tracking-widest uppercase inline-block mb-6 font-semibold">
              Style Guide
            </span>
            <h2 className="font-serif text-5xl font-black mb-6 leading-tight cursor-pointer hover:opacity-70 transition-opacity duration-300">
              Building a Capsule Wardrobe: The Essential Guide
            </h2>
            <p className="text-lg leading-relaxed text-gray-800 mb-8">
              Discover how to create a timeless, versatile wardrobe with fewer pieces that work harder. We break down the essential items every closet needs and how to mix and match them effortlessly.
            </p>
            <div className="flex gap-8 text-sm text-gray-800">
              <span>By Emma Richardson</span>
              <span>•</span>
              <span>January 20, 2024</span>
              <span>•</span>
              <span>8 min read</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <div className="cursor-pointer hover:-translate-y-3 transition-transform duration-300">
            <div className="h-[300px] bg-gray-200 overflow-hidden mb-6">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea2f9eac?w=600&h=400&fit=crop"
                alt="Blog Post"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="bg-black text-white px-4 py-2 text-xs tracking-widest uppercase inline-block mb-4 font-semibold">
              Sustainability
            </span>
            <h3 className="font-serif text-2xl font-bold mb-4 leading-tight">
              The True Cost of Fast Fashion
            </h3>
            <p className="text-sm leading-relaxed text-gray-800 mb-4">
              Understanding the environmental and social impact of fast fashion, and why investing in quality pieces matters more than ever.
            </p>
            <div className="flex gap-4 text-xs text-gray-800">
              <span>January 15, 2024</span>
              <span>•</span>
              <span>6 min read</span>
            </div>
          </div>

          <div className="cursor-pointer hover:-translate-y-3 transition-transform duration-300">
            <div className="h-[300px] bg-gray-200 overflow-hidden mb-6">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop"
                alt="Blog Post"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="bg-black text-white px-4 py-2 text-xs tracking-widest uppercase inline-block mb-4 font-semibold">
              Fashion
            </span>
            <h3 className="font-serif text-2xl font-bold mb-4 leading-tight">
              Spring Styling: Transitional Pieces
            </h3>
            <p className="text-sm leading-relaxed text-gray-800 mb-4">
              How to navigate the changing seasons with versatile pieces that work from winter through spring.
            </p>
            <div className="flex gap-4 text-xs text-gray-800">
              <span>January 10, 2024</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </div>

          <div className="cursor-pointer hover:-translate-y-3 transition-transform duration-300">
            <div className="h-[300px] bg-gray-200 overflow-hidden mb-6">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"
                alt="Blog Post"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="bg-black text-white px-4 py-2 text-xs tracking-widest uppercase inline-block mb-4 font-semibold">
              Behind the Scenes
            </span>
            <h3 className="font-serif text-2xl font-bold mb-4 leading-tight">
              Meet Our Artisans
            </h3>
            <p className="text-sm leading-relaxed text-gray-800 mb-4">
              Go behind the scenes to meet the talented craftspeople who bring our designs to life with their skill and dedication.
            </p>
            <div className="flex gap-4 text-xs text-gray-800">
              <span>January 5, 2024</span>
              <span>•</span>
              <span>7 min read</span>
            </div>
          </div>

          <div className="cursor-pointer hover:-translate-y-3 transition-transform duration-300">
            <div className="h-[300px] bg-gray-200 overflow-hidden mb-6">
              <img
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=400&fit=crop"
                alt="Blog Post"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="bg-black text-white px-4 py-2 text-xs tracking-widest uppercase inline-block mb-4 font-semibold">
              Care Guide
            </span>
            <h3 className="font-serif text-2xl font-bold mb-4 leading-tight">
              How to Care for Your Investment Pieces
            </h3>
            <p className="text-sm leading-relaxed text-gray-800 mb-4">
              Expert tips on maintaining and preserving your garments to ensure they last for years to come.
            </p>
            <div className="flex gap-4 text-xs text-gray-800">
              <span>December 28, 2023</span>
              <span>•</span>
              <span>4 min read</span>
            </div>
          </div>

          <div className="cursor-pointer hover:-translate-y-3 transition-transform duration-300">
            <div className="h-[300px] bg-gray-200 overflow-hidden mb-6">
              <img
                src="https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=400&fit=crop"
                alt="Blog Post"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="bg-black text-white px-4 py-2 text-xs tracking-widest uppercase inline-block mb-4 font-semibold">
              Style Guide
            </span>
            <h3 className="font-serif text-2xl font-bold mb-4 leading-tight">
              Mastering Monochrome Dressing
            </h3>
            <p className="text-sm leading-relaxed text-gray-800 mb-4">
              The art of creating striking outfits using a single color palette and how to add depth through texture and silhouette.
            </p>
            <div className="flex gap-4 text-xs text-gray-800">
              <span>December 20, 2023</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </div>

          <div className="cursor-pointer hover:-translate-y-3 transition-transform duration-300">
            <div className="h-[300px] bg-gray-200 overflow-hidden mb-6">
              <img
                src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=400&fit=crop"
                alt="Blog Post"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="bg-black text-white px-4 py-2 text-xs tracking-widest uppercase inline-block mb-4 font-semibold">
              Sustainability
            </span>
            <h3 className="font-serif text-2xl font-bold mb-4 leading-tight">
              Our Journey to Carbon Neutrality
            </h3>
            <p className="text-sm leading-relaxed text-gray-800 mb-4">
              A transparent look at the steps we're taking to reduce our environmental footprint and achieve our 2025 sustainability goals.
            </p>
            <div className="flex gap-4 text-xs text-gray-800">
              <span>December 15, 2023</span>
              <span>•</span>
              <span>9 min read</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 px-12 py-20 my-20 text-center">
          <h2 className="font-serif text-5xl font-black mb-12">Explore Topics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white p-8 hover:-translate-y-3 hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-4">👗</div>
              <div className="text-lg font-bold mb-2">Style Guide</div>
              <div className="text-xs text-gray-800">24 Articles</div>
            </div>
            <div className="bg-white p-8 hover:-translate-y-3 hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-4">🌱</div>
              <div className="text-lg font-bold mb-2">Sustainability</div>
              <div className="text-xs text-gray-800">18 Articles</div>
            </div>
            <div className="bg-white p-8 hover:-translate-y-3 hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-4">🎨</div>
              <div className="text-lg font-bold mb-2">Behind the Scenes</div>
              <div className="text-xs text-gray-800">15 Articles</div>
            </div>
            <div className="bg-white p-8 hover:-translate-y-3 hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-4">💡</div>
              <div className="text-lg font-bold mb-2">Care Tips</div>
              <div className="text-xs text-gray-800">12 Articles</div>
            </div>
          </div>
        </div>

        <div className="bg-black text-white px-12 py-20 text-center">
          <h2 className="font-serif text-5xl font-black mb-6">Stay Updated</h2>
          <p className="text-lg leading-relaxed mb-10 opacity-90">
            Subscribe to our newsletter for the latest style tips, sustainability insights, and exclusive content.
          </p>
          <form className="max-w-lg mx-auto flex border border-white border-opacity-30 overflow-hidden">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-6 py-5 bg-transparent text-white outline-none placeholder:text-white placeholder:opacity-50 text-base"
            />
            <button
              type="submit"
              className="bg-white text-black px-10 py-5 font-semibold hover:bg-gray-200 transition-all duration-300 uppercase tracking-wider text-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}