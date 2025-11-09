import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  TrendingUp,
  FileText,
  MessageSquare,
  Zap,
  Shield,
} from "lucide-react";
import logo from "@/assets/plutort-logo.png"; // your custom logo

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced AI analyzes your content and extracts key insights automatically.",
    color: "from-[#00B4D8] to-[#0077B6]",
  },
  {
    icon: TrendingUp,
    title: "Sentiment Detection",
    description:
      "Understand the emotional tone and sentiment patterns in your documents.",
    color: "from-[#90E0EF] to-[#00B4D8]",
  },
  {
    icon: FileText,
    title: "Smart Summaries",
    description:
      "Get concise, intelligent summaries of lengthy articles and PDFs.",
    color: "from-[#48CAE4] to-[#0096C7]",
  },
  {
    icon: MessageSquare,
    title: "Interactive Chat",
    description:
      "Ask follow-up questions and dive deeper into your analysis.",
    color: "from-[#00B4D8] to-[#48CAE4]",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Lightning-fast processing with real-time insights and visualizations.",
    color: "from-[#0077B6] to-[#023E8A]",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data is encrypted and stored securely with enterprise-grade protection.",
    color: "from-[#00B4D8] to-[#03045E]",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* --- Header / Hero Section --- */}
      <section className="text-center py-20">
        <div className="flex justify-center items-center mb-6 gap-2">
          <img
            src={logo}
            alt="PlutoRT Logo"
            className="h-12 w-12 object-contain transition-transform duration-300 hover:scale-110 hover:drop-shadow-[0_0_10px_#00B4D8]"
          />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            PlutoRT
          </h1>
        </div>

        <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
          Your intelligent AI research tool for analyzing articles, news, and data
          — fast, accurate, and insightful.
        </p>
      </section>

      {/* --- Features Section with Animations --- */}
      <section className="py-16 px-6 md:px-20 bg-muted/30">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Explore Powerful Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                  <CardContent className="p-6 space-y-4">
                    <div
                      className={`p-4 rounded-xl w-fit bg-gradient-to-br ${feature.color} shadow-md hover:shadow-lg transition-all duration-300`}
                    >
                      <Icon className="h-7 w-7 text-white drop-shadow-sm" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="text-center py-8 text-muted-foreground text-sm">
        © {new Date().getFullYear()} PlutoRT. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
