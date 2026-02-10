"use client";

import { motion } from "framer-motion";
import { Newspaper, Download, ExternalLink, Calendar, Building, FileText } from "lucide-react";

const pressReleases = [
  {
    id: 1,
    outlet: "VOGUE MAGAZINE",
    title: "MONOCHROME: The Future of Minimalist Fashion",
    description: "In an exclusive interview, MONOCHROME's founders discuss their vision for sustainable luxury and how they're revolutionizing the fashion industry.",
    date: "January 15, 2024",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea2f9eac?w=800&h=600&fit=crop",
    featured: true,
  },
  {
    id: 2,
    outlet: "ELLE",
    title: "10 Brands Leading the Sustainable Fashion Movement",
    description: "MONOCHROME ranks among the top sustainable fashion brands making a real difference in the industry.",
    date: "December 8, 2023",
  },
  {
    id: 3,
    outlet: "HARPER'S BAZAAR",
    title: "The Minimalist Wardrobe: A Guide",
    description: "Fashion editors reveal their favorite pieces from MONOCHROME's Winter Collection.",
    date: "November 22, 2023",
  },
  {
    id: 4,
    outlet: "THE NEW YORK TIMES",
    title: "Small Brands, Big Impact: Fashion's New Wave",
    description: "How independent brands like MONOCHROME are challenging luxury giants.",
    date: "October 30, 2023",
  },
  {
    id: 5,
    outlet: "FORBES",
    title: "30 Under 30: Retail & E-Commerce",
    description: "MONOCHROME's co-founders featured in Forbes' prestigious 30 Under 30 list.",
    date: "August 5, 2023",
  },
  {
    id: 6,
    outlet: "WWD",
    title: "Breaking Down the Black and White Collection",
    description: "An exclusive first look at MONOCHROME's latest collection.",
    date: "July 12, 2023",
  },
];

const mediaKit = [
  { icon: <FileText />, title: "Brand Guidelines", size: "PDF • 2.5 MB" },
  { icon: <Newspaper />, title: "Logo Pack", size: "ZIP • 5.2 MB" },
  { icon: <Building />, title: "Company Overview", size: "PDF • 1.8 MB" },
  { icon: <Download />, title: "Product Images", size: "ZIP • 45 MB" },
  { icon: <Calendar />, title: "Founder Photos", size: "ZIP • 12 MB" },
  { icon: <ExternalLink />, title: "Video Assets", size: "ZIP • 120 MB" },
];

export default function PressModern() {
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
              MEDIA CENTER
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Press
            </h1>
            <p className="text-xl text-muted-foreground dark:text-slate-300 leading-relaxed">
              Latest news, press releases, and media coverage about MONOCHROME.
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
          className="bg-card dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-border dark:border-slate-700 overflow-hidden"
        >
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="relative overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 z-10" />
              <div className="aspect-video bg-gradient-to-br from-secondary to-accent/10 rounded-xl" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                <Newspaper className="w-3 h-3" />
                {pressReleases[0].outlet}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {pressReleases[0].title}
              </h2>
              <p className="text-muted-foreground dark:text-slate-300 mb-6">
                {pressReleases[0].description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {pressReleases[0].date}
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 border border-border dark:border-slate-600 rounded-lg font-medium hover:bg-accent/10 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  Read Article
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 mb-20">
        <h2 className="text-3xl font-bold mb-8">Latest Coverage</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pressReleases.slice(1).map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="group bg-card dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-border dark:border-slate-700 p-6 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Newspaper className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {article.outlet}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-muted-foreground dark:text-slate-300 mb-4 line-clamp-3">
                {article.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {article.date}
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </motion.article>
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
          <h2 className="text-3xl font-bold mb-8 text-center">Media Resources</h2>
          <p className="text-center opacity-90 mb-12 max-w-2xl mx-auto">
            Download our official brand assets, product images, and press materials for editorial use.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaKit.map((item, index) => (
              <motion.button
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left hover:bg-white/20 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <Download className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="font-medium mb-2">{item.title}</div>
                <div className="text-sm opacity-70">{item.size}</div>
              </motion.button>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors">
              Download Full Media Kit
            </button>
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
          <h2 className="text-3xl font-bold mb-8">Press Inquiries</h2>
          <p className="text-muted-foreground dark:text-slate-300 mb-12 max-w-2xl mx-auto">
            For press inquiries, interviews, or collaboration opportunities, please reach out to our media team.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "📧", title: "Email", value: "press@monochrome.com" },
              { icon: "📱", title: "Phone", value: "+1 (212) 555-0100" },
              { icon: "💬", title: "Social", value: "@monochrome" },
            ].map((contact) => (
              <div
                key={contact.title}
                className="bg-card dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-border dark:border-slate-700 p-6"
              >
                <div className="text-3xl mb-4">{contact.icon}</div>
                <div className="text-sm text-muted-foreground mb-2">{contact.title}</div>
                <div className="font-semibold">{contact.value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}