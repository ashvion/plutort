import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  FileText,
  MessageSquare,
  TrendingUp,
  Zap,
  Shield,
  Search,
  BarChart3,
  Database
} from "lucide-react";
import ChatBot from "@/components/ChatBot";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  // 🌈 Updated Features with Themed Gradients and Relevant Icons
  const features = [
    {
      icon: Search,
      title: "AI-Powered Analysis",
      description:
        "Advanced AI scans your content and extracts deep insights automatically.",
      color: "from-[#00B4D8] to-[#0077B6]",
    },
    {
      icon: TrendingUp,
      title: "Sentiment Detection",
      description:
        "Understand emotional tones and sentiment patterns in your documents.",
      color: "from-[#90E0EF] to-[#00B4D8]",
    },
    {
      icon: FileText,
      title: "Smart Summaries",
      description:
        "Get concise, intelligent summaries of lengthy articles and PDFs instantly.",
      color: "from-[#48CAE4] to-[#0096C7]",
    },
    {
      icon: MessageSquare,
      title: "Interactive Chat",
      description:
        "Ask questions, clarify results, and explore your data through AI conversation.",
      color: "from-[#00B4D8] to-[#48CAE4]",
    },
    {
      icon: BarChart3,
      title: "Instant Insights",
      description:
        "Visualize data trends with real-time charts and analytical breakdowns.",
      color: "from-[#0077B6] to-[#023E8A]",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your research data is encrypted and handled with enterprise-grade protection.",
      color: "from-[#00B4D8] to-[#03045E]",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">PlutoRT</span>
            </div>
            <Button onClick={() => navigate("/analyze")} size="lg">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-secondary-foreground text-sm font-medium">
            <Zap className="h-4 w-4" />
            Powered by Advanced AI
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Research Smarter with{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AI Analysis
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform articles and documents into actionable insights. Get
            AI-powered summaries, sentiment analysis, and interactive Q&A in
            seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/analyze")}
              className="text-lg px-8"
            >
              Start Analyzing
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowChat(true)}
              className="text-lg px-8"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Ask Questions
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for Research
          </h2>
          <p className="text-muted-foreground text-lg">
            Powerful tools to help you understand and analyze content faster
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card
                key={idx}
                className="border-2 hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1 duration-300"
              >
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
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple 3-Step Process
          </h2>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold">Add Content</h3>
            <p className="text-muted-foreground">
              Paste a URL or upload a PDF document
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold">AI Analysis</h3>
            <p className="text-muted-foreground">
              Get instant insights, summaries, and charts
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold">Explore & Export</h3>
            <p className="text-muted-foreground">
              Chat with AI and export your findings
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-2 bg-gradient-primary text-primary-foreground">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Research?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of researchers, students, and professionals using
              AI to understand content faster.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/analyze")}
              className="text-lg px-8"
            >
              Start Free Now
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 PlutoRT. Powered by Advanced AI Technology.</p>
        </div>
      </footer>

      {/* Floating Chatbot */}
      {showChat && <ChatBot onClose={() => setShowChat(false)} />}
    </div>
  );
};

export default Landing;
