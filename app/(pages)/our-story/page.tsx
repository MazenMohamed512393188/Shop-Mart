"use client";

import { motion } from "framer-motion";
import { Target, Heart, Award, Users, Calendar, Globe, Sparkles } from "lucide-react";

const timeline = [
  { year: "2015", title: "The Foundation", description: "MONOCHROME opens its first boutique in SoHo, New York. With just 20 carefully curated pieces, we begin our journey to redefine minimalist fashion." },
  { year: "2017", title: "Expanding Horizons", description: "Our second location opens in Los Angeles, bringing our aesthetic to the West Coast. We launch our first online platform, making our collection accessible worldwide." },
  { year: "2019", title: "Sustainable Innovation", description: "We introduce our eco-conscious line, using 100% organic and recycled materials. Our commitment to sustainability becomes a core pillar of our brand identity." },
  { year: "2022", title: "Global Recognition", description: "MONOCHROME is featured in Vogue, Elle, and Harper's Bazaar. We open flagship stores in London and Paris, establishing ourselves as a global brand." },
  { year: "2024", title: "The Future", description: "Today, we serve over 50,000 customers worldwide, but our mission remains the same: to create timeless pieces that empower and inspire." },
];

const values = [
  { icon: <Target />, title: "Craftsmanship", description: "Every piece is meticulously crafted by skilled artisans who take pride in their work." },
  { icon: <Heart />, title: "Sustainability", description: "We're committed to ethical practices and environmental responsibility in everything we do." },
  { icon: <Sparkles />, title: "Timelessness", description: "We create pieces that transcend trends, designed to be loved for years to come." },
  { icon: <Users />, title: "Community", description: "Building lasting relationships with our customers and supporting artisan communities." },
  { icon: <Award />, title: "Excellence", description: "Pursuing perfection in every detail, from design to customer experience." },
  { icon: <Globe />, title: "Innovation", description: "Continuously evolving while staying true to our minimalist philosophy." },
];

export default function OurStoryModern() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 dark:from-slate-900 dark:to-slate-800/30">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
        <div className="container mx-auto px-4 py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground text-sm font-medium mb-6">
              OUR JOURNEY
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Our Story
            </h1>
            <p className="text-xl text-muted-foreground dark:text-slate-300 leading-relaxed">
              A journey of passion, dedication, and timeless elegance that began with a simple vision to revolutionize fashion.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-9xl">🎨</div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">The Beginning</h2>
            <p className="text-lg text-muted-foreground dark:text-slate-300 mb-4 leading-relaxed">
              MONOCHROME was born from a simple belief: that true style doesn't need to shout. In a world of fast fashion and fleeting trends, we wanted to create something different—something that would stand the test of time.
            </p>
            <p className="text-lg text-muted-foreground dark:text-slate-300 leading-relaxed">
              Our founders, Emma Richardson and James Sullivan, started with a small atelier in New York City. Their vision was clear: to craft pieces that embodied both elegance and simplicity, using only the finest materials and traditional craftsmanship.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Philosophy</h2>
            <p className="text-lg text-muted-foreground dark:text-slate-300 mb-4 leading-relaxed">
              We believe that fashion should be an expression of individuality, not conformity. Every piece in our collection is designed to be versatile, timeless, and effortlessly sophisticated.
            </p>
            <p className="text-lg text-muted-foreground dark:text-slate-300 leading-relaxed">
              Our commitment to quality means that each garment is made to last. We use sustainable practices and ethical sourcing, ensuring that our beautiful pieces don't come at the cost of our planet or its people.
            </p>
          </div>
          <div className="relative order-1 md:order-2">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-tl from-primary/20 to-accent/20">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-9xl">✨</div>
              </div>
            </div>
            <div className="absolute -top-6 -left-6 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-card dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-border dark:border-slate-700 p-8 md:p-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-[120px_1fr] gap-8 group"
              >
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                      {item.year}
                    </div>
                    <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-8 h-px bg-border dark:bg-slate-700 md:block hidden" />
                    <Calendar className="absolute -right-4 top-1/2 -translate-y-1/2 text-primary w-4 h-4 md:block hidden opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="pb-8 border-b border-border dark:border-slate-700 last:border-0">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground dark:text-slate-300">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group bg-card dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-border dark:border-slate-700 p-6 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">By The Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "50K+", label: "Happy Customers" },
              { value: "9", label: "Countries" },
              { value: "12", label: "Years" },
              { value: "4.8★", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}