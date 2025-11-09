import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, FileText, MessageSquare, TrendingUp, Zap, Shield, Link } from "lucide-react";
import ChatBot from "@/components/ChatBot";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced AI analyzes your content and extracts key insights automatically"
    },
    {
      icon: TrendingUp,
      title: "Sentiment Detection",
      description: "Understand the emotional tone and sentiment patterns in your documents"
    },
    {
      icon: FileText,
      title: "Smart Summaries",
      description: "Get concise, intelligent summaries of lengthy articles and PDFs"
    },
    {
      icon: MessageSquare,
      title: "Interactive Chat",
      description: "Ask follow-up questions and dive deeper into your analysis"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Lightning-fast processing with real-time insights and visualizations"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and stored securely with enterprise-grade protection"
    }
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
            Transform articles and documents into actionable insights. Get AI-powered summaries, 
            sentiment analysis, and interactive Q&A in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/analyze")} className="text-lg px-8">
              Start Analyzing
            </Button>
            <Button size="lg" variant="outline" onClick={() => setShowChat(true)} className="text-lg px-8">
              <MessageSquare className="mr-2 h-5 w-5" />
              Ask Questions
            </Button>
          </div>

          {/* Demo Visual */} 
          {/* <div className="mt-12">
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
            <Card className="relative border-2 shadow-2xl">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  <div className="space-y-2">
                    <div className="h-3 bg-primary/20 rounded w-3/4" />
                    <div className="h-3 bg-primary/10 rounded w-full" />
                    <div className="h-3 bg-primary/10 rounded w-5/6" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-accent/20 rounded w-2/3" />
                    <div className="h-3 bg-accent/10 rounded w-full" />
                    <div className="h-3 bg-accent/10 rounded w-4/5" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-secondary rounded w-3/5" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div> 
        </div>
      </section> */}

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for Research
          </h2>
          <p className="text-muted-foreground text-lg">
            Powerful features to help you understand and analyze content faster
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 bg-gradient-primary rounded-lg w-fit">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
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
            <p className="text-muted-foreground">Paste a URL or upload a PDF document</p>
          </div>

          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold">AI Analysis</h3>
            <p className="text-muted-foreground">Get instant insights, summaries, and charts</p>
          </div>

          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold">Explore & Export</h3>
            <p className="text-muted-foreground">Chat with AI and export your findings</p>
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
              Join thousands of researchers, students, and professionals using AI to understand content faster
            </p>
            <Button size="lg" variant="secondary" onClick={() => navigate("/analyze")} className="text-lg px-8">
              Start Free Now
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2024 AI Research Tool. Powered by advanced AI technology.</p>
        </div>
      </footer>

      {/* Floating Chatbot */}
      {showChat && <ChatBot onClose={() => setShowChat(false)} />}
    </div>
  );
};

export default Landing;
