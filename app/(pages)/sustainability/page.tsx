"use client";

import { motion } from "framer-motion";
import { Leaf, Recycle, Factory, Globe, Target, Heart, TrendingUp, Users } from "lucide-react";

const initiatives = [
  {
    icon: <Leaf />,
    title: "Sustainable Materials",
    items: [
      "100% organic cotton certified by GOTS",
      "Recycled polyester from ocean plastics",
      "Sustainable wool from ethical farms",
      "Plant-based dyes and natural fibers",
      "Biodegradable packaging materials",
    ],
  },
  {
    icon: <Recycle />,
    title: "Circular Fashion",
    items: [
      "Garment recycling program in all stores",
      "Repair and alteration services",
      "Second-hand marketplace platform",
      "Upcycling initiatives for damaged items",
      "Zero-waste pattern cutting techniques",
    ],
  },
  {
    icon: <Factory />,
    title: "Ethical Production",
    items: [
      "Fair Trade certified manufacturing partners",
      "Regular third-party factory audits",
      "Living wages for all workers",
      "Safe and healthy working conditions",
      "Support for artisan communities",
    ],
  },
  {
    icon: <Globe />,
    title: "Carbon Neutral",
    items: [
      "100% renewable energy in our facilities",
      "Carbon-neutral shipping options",
      "Investment in reforestation projects",
      "Local manufacturing to reduce transport",
      "Annual carbon footprint reporting",
    ],
  },
];

const commitments = [
  {
    year: "2025",
    icon: <Target />,
    title: "2025 Goals",
    description: "Achieve 100% sustainable material usage across all product lines. Eliminate single-use plastics from our packaging and reduce water consumption in manufacturing by 40%.",
  },
  {
    year: "2030",
    icon: <TrendingUp />,
    title: "2030 Vision",
    description: "Become a fully circular fashion brand with closed-loop production. Achieve carbon negativity by removing more carbon from the atmosphere than we emit.",
  },
  {
    year: "Future",
    icon: <Heart />,
    title: "Long-term Impact",
    description: "Lead the fashion industry in sustainable innovation. Inspire and support other brands to adopt ethical practices. Create a positive environmental and social legacy.",
  },
];

const partners = [
  { name: "GOTS Certified", description: "Global Organic Textile Standard" },
  { name: "Fair Trade", description: "Ethical trading partnership" },
  { name: "B Corporation", description: "Meeting highest social standards" },
  { name: "1% For The Planet", description: "Environmental commitment" },
];

export default function SustainabilityModern() {
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
              OUR COMMITMENT
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Sustainability
            </h1>
            <p className="text-xl text-muted-foreground dark:text-slate-300 leading-relaxed">
              Fashion that respects our planet. We're committed to creating beautiful pieces responsibly.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-card dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-border dark:border-slate-700 p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground dark:text-slate-300 leading-relaxed max-w-4xl mx-auto">
            At MONOCHROME, we believe that sustainable fashion is not just a trend—it's a responsibility. 
            We're committed to minimizing our environmental impact while creating timeless pieces that last. 
            From sourcing materials to manufacturing and delivery, every step of our process is designed with the planet in mind.
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 mb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {initiatives.map((initiative, index) => (
            <motion.div
              key={initiative.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-border dark:border-slate-700 p-6 md:p-8"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-6">
                {initiative.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{initiative.title}</h3>
              <ul className="space-y-3">
                {initiative.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 text-success flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span className="text-muted-foreground dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12 text-white"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact in 2024</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "95%", label: "Sustainable Materials Used" },
              { value: "50K", label: "Garments Recycled" },
              { value: "0", label: "Landfill Waste" },
              { value: "100%", label: "Renewable Energy" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
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
        >
          <h2 className="text-3xl font-bold text-center mb-12">Our Commitments for the Future</h2>
          <div className="space-y-6">
            {commitments.map((commitment, index) => (
              <motion.div
                key={commitment.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-border dark:border-slate-700 p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                      {commitment.year}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        {commitment.icon}
                      </div>
                      <h3 className="text-xl font-bold">{commitment.title}</h3>
                    </div>
                    <p className="text-muted-foreground dark:text-slate-300">
                      {commitment.description}
                    </p>
                  </div>
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
          <h2 className="text-3xl font-bold mb-12">Our Sustainability Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="bg-card dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-border dark:border-slate-700 p-6 hover:-translate-y-2 transition-transform"
              >
                <div className="font-bold text-lg mb-2">{partner.name}</div>
                <div className="text-sm text-muted-foreground">{partner.description}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

\      <div className="container mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8 md:p-12 text-center border border-border dark:border-slate-700"
        >
          <Users className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Sustainable Journey</h2>
          <p className="text-muted-foreground dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Together, we can create a fashion industry that values people and planet as much as profit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Learn More About Our Process
            </button>
            <button className="px-6 py-3 border border-border dark:border-slate-600 rounded-lg font-semibold hover:bg-accent/10 transition-colors">
              View Our Sustainability Report
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}