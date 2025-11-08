import { useState } from "react";
import Layout from "@/components/Layout";
import AnalysisInput from "@/components/AnalysisInput";
import AnalysisResult from "@/components/AnalysisResult";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);

  const { data: analysis, isLoading } = useQuery({
    queryKey: ["analysis", selectedAnalysisId],
    queryFn: async () => {
      if (!selectedAnalysisId) return null;
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", selectedAnalysisId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedAnalysisId,
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI-Powered Research Tool
          </h1>
          <p className="text-muted-foreground text-lg">
            Analyze articles and documents with cutting-edge AI technology
          </p>
        </div>

        <AnalysisInput onAnalysisComplete={setSelectedAnalysisId} />

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {analysis && !isLoading && <AnalysisResult analysis={analysis} />}
      </div>
    </Layout>
  );
};

export default Index;
