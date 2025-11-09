import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link2, Loader2, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisInputProps {
  onAnalysisComplete: (result: any) => void;
}

const AnalysisInput = ({ onAnalysisComplete }: AnalysisInputProps) => {
  const [urls, setUrls] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addUrlField = () => {
    if (urls.length < 3) {
      setUrls([...urls, ""]);
    }
  };

  const removeUrlField = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleAnalysis = async () => {
    const validUrls = urls.filter(url => url.trim());
    
    if (validUrls.length === 0) {
      toast({
        title: "URL Required",
        description: "Please enter at least one URL to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Call edge function to analyze URLs
      const { data, error } = await supabase.functions.invoke("analyze-content", {
        body: { type: "url", urls: validUrls }
      });

      if (error) {
        // Check if it's a blocking error
        if (error.message?.includes("Unable to extract content")) {
          toast({
            title: "Content Blocked",
            description: "The website is blocking automated access. Try a different URL or copy the article text directly.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Analysis Complete",
        description: "Your content has been analyzed successfully!",
      });

      onAnalysisComplete(data);
      setUrls([""]);
    } catch (error: any) {
      console.error("Analysis error:", error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to analyze content";
      if (error.message?.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message?.includes("blocked")) {
        errorMessage = "The website is blocking automated access. Try copying the article text instead.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
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
          Enter up to 3 URLs to get AI-powered insights
          <br />
          <span className="text-xs text-muted-foreground mt-1 block">
            Note: Some websites may block automated access. If analysis fails, try a different source.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {urls.map((url, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`url-${index}`}>URL {index + 1}</Label>
            <div className="flex gap-2">
              <Input
                id={`url-${index}`}
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => updateUrl(index, e.target.value)}
              />
              {urls.length > 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeUrlField(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {urls.length < 3 && (
          <Button
            variant="outline"
            onClick={addUrlField}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another URL
          </Button>
        )}

        <Button onClick={handleAnalysis} disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Link2 className="mr-2 h-4 w-4" />
          Analyze URLs
        </Button>
      </CardContent>
    </Card>
  );
};

export default AnalysisInput;
