import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  FileText,
  MessageSquare,
  TrendingUp,
  Zap,
  Shield,
} from "lucide-react";
import ChatBot from "@/components/ChatBot";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/plutort-logo.png"; // ✅ your custom logo here

const Landing = () => {
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Advanced AI analyzes your content and extracts key insights automatically",
    },
    {
      icon: TrendingUp,
      title: "Sentiment Detection",
      description:
        "Understand the emotional tone and sentiment patterns in your documents",
    },
    {
      icon: FileText,
      title: "Smart Summaries",
      description:
        "Get concise, intelligent summaries of lengthy articles and PDFs",
    },
    {
      icon: MessageSquare,
      title: "Interactive Chat",
      description:
        "Ask follow-up questions and dive deeper into your analysis",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description:
        "Lightning-fast processing with real-time insights and visualizations",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your data is encrypted and stored securely with enterprise-grade protection",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#13293D] to-[#1B263B] text-white relative overflow-hidden">
      {/* 🌌 Animated Glow Background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="PlutoRT Logo"
                className="h-10 w-10 object-contain drop-shadow-md"
              />
              <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                PlutoRT
              </span>
            </div>
            <Button
              onClick={() => navigate("/analyze")}
              size="lg"
              className="text-lg px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-[0_0_15px_#00B4D8] transition-all duration-300"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm font-medium">
            <Zap className="h-4 w-4 text-cyan-400" />
            Powered by Advanced AI
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Research Smarter with{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI Analysis
            </span>
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Transform articles and documents into actionable insights. Get AI-powered
            summaries, sentiment analysis, and interactive Q&A in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/analyze")}
              className="text-lg px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-[0_0_20px_#00B4D8] transition-all duration-300"
            >
              Start Analyzing
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowChat(true)}
              className="text-lg px-8 border-cyan-400 text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Ask Questions
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Everything You Need for Research
          </h2>
          <p className="text-gray-300 text-lg">
            Powerful features to help you understand and analyze content faster
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
              >
                <Card className="border border-white/10 bg-white/5 backdrop-blur-lg hover:border-cyan-400/40 hover:shadow-[0_0_20px_#00B4D8] transition-all duration-300">
                  <CardContent className="p-6 space-y-4">
                    <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg w-fit shadow-lg">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="border border-cyan-400/40 bg-gradient-to-r from-cyan-600/30 to-blue-700/30 backdrop-blur-lg text-white text-center shadow-lg">
            <CardContent className="p-12 space-y-6">
              <h2 className="text-4xl font-bold">
                Ready to Transform Your Research?
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Join thousands of researchers, students, and professionals using AI to
                understand content faster.
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/analyze")}
                className="text-lg px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-[0_0_20px_#00B4D8] transition-all duration-300"
              >
                Start Free Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/5 backdrop-blur-md mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400 text-sm">
          <p>© 2025 PlutoRT — Powered by Advanced AI Technology</p>
        </div>
      </footer>

      {/* Chatbot */}
      {showChat && <ChatBot onClose={() => setShowChat(false)} />}
    </div>
  );
};

export default Landing;
