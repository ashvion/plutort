import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link2, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisInputProps {
  onAnalysisComplete: (analysisId: string) => void;
}

const AnalysisInput = ({ onAnalysisComplete }: AnalysisInputProps) => {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUrlAnalysis = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Call edge function to analyze URL
      const { data, error } = await supabase.functions.invoke("analyze-content", {
        body: { type: "url", content: url }
      });

      if (error) throw error;

      // Save analysis to database
      const { data: analysis, error: dbError } = await supabase
        .from("analyses")
        .insert({
          user_id: user.id,
          title: data.title || "URL Analysis",
          source_type: "url",
          source_url: url,
          summary: data.summary,
          keywords: data.keywords,
          sentiment: data.sentiment,
          insights: data.insights,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast({
        title: "Analysis Complete",
        description: "Your content has been analyzed successfully!",
      });

      onAnalysisComplete(analysis.id);
      setUrl("");
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileAnalysis = async () => {
    if (!file) {
      toast({
        title: "File Required",
        description: "Please select a PDF file to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload file to storage
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Call edge function to analyze PDF
      const { data, error } = await supabase.functions.invoke("analyze-content", {
        body: { type: "pdf", filePath }
      });

      if (error) throw error;

      // Save analysis to database
      const { data: analysis, error: dbError } = await supabase
        .from("analyses")
        .insert({
          user_id: user.id,
          title: file.name,
          source_type: "pdf",
          file_path: filePath,
          summary: data.summary,
          keywords: data.keywords,
          sentiment: data.sentiment,
          insights: data.insights,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast({
        title: "Analysis Complete",
        description: "Your PDF has been analyzed successfully!",
      });

      onAnalysisComplete(analysis.id);
      setFile(null);
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze PDF",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyze Content</CardTitle>
        <CardDescription>
          Enter a URL or upload a PDF to get AI-powered insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="url">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">
              <Link2 className="h-4 w-4 mr-2" />
              URL
            </TabsTrigger>
            <TabsTrigger value="pdf">
              <Upload className="h-4 w-4 mr-2" />
              PDF
            </TabsTrigger>
          </TabsList>
          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Article URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <Button onClick={handleUrlAnalysis} disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze URL
            </Button>
          </TabsContent>
          <TabsContent value="pdf" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pdf">PDF Document</Label>
              <Input
                id="pdf"
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button onClick={handleFileAnalysis} disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze PDF
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalysisInput;
