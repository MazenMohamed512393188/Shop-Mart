"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Heart, 
  GraduationCap, 
  Coffee, 
  Users, 
  Gift,
  MapPin,
  DollarSign,
  Calendar,
  Send,
  CheckCircle
} from "lucide-react";

const benefits = [
  { icon: <Briefcase />, title: "Competitive Salary", description: "Industry-leading compensation packages with performance bonuses." },
  { icon: <Heart />, title: "Health & Wellness", description: "Comprehensive health insurance, mental health support, and wellness programs." },
  { icon: <GraduationCap />, title: "Learning & Growth", description: "Annual learning budgets, mentorship programs, and career development." },
  { icon: <Coffee />, title: "Work-Life Balance", description: "Flexible working hours, remote options, and generous vacation policy." },
  { icon: <Users />, title: "Team Culture", description: "Regular team events, collaborative workspace, and inclusive environment." },
  { icon: <Gift />, title: "Employee Discount", description: "Exclusive access to our collections with generous staff discounts." },
];

const positions = [
  {
    id: 1,
    title: "Senior Fashion Designer",
    type: "Full-Time",
    location: "New York, NY",
    salary: "$80,000 - $120,000",
    posted: "2 days ago",
    description: "We're seeking an experienced fashion designer to join our creative team. You'll be responsible for developing new collections that align with our minimalist aesthetic while pushing creative boundaries.",
    requirements: ["5+ years experience", "Portfolio required", "Strong technical skills"],
  },
  {
    id: 2,
    title: "E-Commerce Manager",
    type: "Full-Time",
    location: "Remote",
    salary: "$70,000 - $95,000",
    posted: "1 week ago",
    description: "Lead our digital commerce strategy and oversee our online platform. The ideal candidate has a proven track record in e-commerce growth and customer experience optimization.",
    requirements: ["3+ years experience", "Analytical skills", "Team management"],
  },
  {
    id: 3,
    title: "Store Manager",
    type: "Full-Time",
    location: "Los Angeles, CA",
    salary: "$55,000 - $75,000",
    posted: "3 days ago",
    description: "Manage daily operations of our flagship LA store. You'll lead a team of associates, ensure exceptional customer service, and drive sales while maintaining our brand standards.",
    requirements: ["Retail management", "Leadership skills", "Customer service"],
  },
  {
    id: 4,
    title: "Social Media Specialist",
    type: "Full-Time",
    location: "Remote",
    salary: "$50,000 - $70,000",
    posted: "5 days ago",
    description: "Create compelling content and manage our social media presence across all platforms. We're looking for someone who understands our aesthetic and can engage our community authentically.",
    requirements: ["Content creation", "Social media expertise", "Creative writing"],
  },
  {
    id: 5,
    title: "Sustainability Coordinator",
    type: "Full-Time",
    location: "New York, NY",
    salary: "$60,000 - $80,000",
    posted: "1 week ago",
    description: "Drive our sustainability initiatives and ensure ethical practices throughout our supply chain. You'll work cross-functionally to implement eco-friendly solutions.",
    requirements: ["Sustainability experience", "Project management", "Communication skills"],
  },
];

export default function CareersModern() {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [applicationSent, setApplicationSent] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 dark:from-slate-900 dark:to-slate-800/30">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
        <div className="container mx-auto px-4 py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground text-sm font-medium mb-6">
              JOIN OUR TEAM
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Careers
            </h1>
            <p className="text-xl text-muted-foreground dark:text-slate-300 leading-relaxed">
              Be part of a team that's redefining fashion. We're looking for passionate individuals who share our vision.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Culture Section */}
      <div className="container mx-auto px-4 -mt-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-card dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-border dark:border-slate-700 p-8 md:p-12"
        >
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Work With Us?</h2>
            <p className="text-lg text-muted-foreground dark:text-slate-300 mb-12 leading-relaxed">
              At MONOCHROME, we believe that our people are our greatest asset. We've built a culture that values creativity, collaboration, and continuous growth.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="group bg-background/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-xl border border-border dark:border-slate-700 p-6 hover:border-primary/50 hover:shadow-lg transition-all"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Open Positions */}
      <div className="container mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Open Positions</h2>
            <p className="text-muted-foreground dark:text-slate-300">
              Find the perfect role for your skills and passion
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {positions.map((position, index) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group bg-card dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-border dark:border-slate-700 overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer ${
                  selectedPosition === position.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedPosition(position.id === selectedPosition ? null : position.id)}
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {position.title}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {position.type}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs">
                          <MapPin className="w-3 h-3" />
                          {position.location}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs">
                          <DollarSign className="w-3 h-3" />
                          {position.salary}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs">
                          <Calendar className="w-3 h-3" />
                          {position.posted}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {position.requirements.map((req, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs">
                          <CheckCircle className="w-3 h-3" />
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {selectedPosition === position.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 border-t border-border dark:border-slate-700">
                        <p className="text-muted-foreground dark:text-slate-300 mb-6">
                          {position.description}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setApplicationSent(true);
                              setTimeout(() => setApplicationSent(false), 3000);
                            }}
                            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            {applicationSent ? "Application Sent!" : "Apply Now"}
                          </button>
                          <button className="px-6 py-2.5 border border-border dark:border-slate-600 rounded-lg font-semibold hover:bg-accent/10 transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Don't See Your Role?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Send us your resume and let's start a conversation about your future with MONOCHROME.
          </p>
          <button
            onClick={() => setApplicationSent(true)}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
          >
            <Send className="w-4 h-4" />
            Submit Your Application
          </button>
          {applicationSent && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm opacity-80"
            >
              ✓ Thank you! We'll review your application shortly.
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "95%", label: "Employee Satisfaction" },
            { value: "50+", label: "Team Members" },
            { value: "4.8", label: "Avg. Rating" },
            { value: "24/7", label: "Support" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-border dark:border-slate-700 p-6 text-center"
            >
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}