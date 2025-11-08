import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: analyses, isLoading, refetch } = useQuery({
    queryKey: ["all-analyses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("analyses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Analysis deleted successfully",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analysis Dashboard</h1>
          <p className="text-muted-foreground">View and manage all your analyses</p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && analyses && analyses.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No analyses yet. Start by analyzing content!</p>
              <Button className="mt-4" onClick={() => navigate("/")}>
                Analyze Content
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {analyses?.map((analysis) => (
            <Card key={analysis.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{analysis.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={analysis.source_type === "url" ? "default" : "secondary"}>
                        {analysis.source_type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(analysis.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/chat/${analysis.id}`)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(analysis.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2">{analysis.summary}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
