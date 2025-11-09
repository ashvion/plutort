import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnalysisInput from "@/components/AnalysisInput";
import AnalysisResult from "@/components/AnalysisResult";
import ChatBot from "@/components/ChatBot";

const Analyze = () => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  const handleAnalysisComplete = (result: any) => {
    setAnalysis(result);
    setShowChat(true);
  };

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
              <span className="font-bold text-lg">AI Research Tool</span>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI-Powered Research Tool
            </h1>
            <p className="text-muted-foreground text-lg">
              Analyze articles and documents with cutting-edge AI technology
            </p>
          </div>

          {!analysis ? (
            <div className="max-w-2xl mx-auto">
              <AnalysisInput onAnalysisComplete={handleAnalysisComplete} />
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Analysis Results */}
              <div className="space-y-6">
                <AnalysisResult analysis={analysis} />
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setAnalysis(null);
                    setShowChat(false);
                  }}
                  className="w-full"
                >
                  Analyze New Content
                </Button>
              </div>

              {/* Chatbot */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                {showChat && (
                  <ChatBot 
                    onClose={() => setShowChat(false)}
                    context={`${analysis.summary}\n\n${analysis.insights}`}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analyze;
