import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Chat = () => {
  const { analysisId } = useParams();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: analysis } = useQuery({
    queryKey: ["analysis", analysisId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", analysisId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: messages, isLoading } = useQuery({
    queryKey: ["chat-messages", analysisId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("analysis_id", analysisId)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Save user message
      const { error: userMsgError } = await supabase
        .from("chat_messages")
        .insert({
          analysis_id: analysisId,
          user_id: user.id,
          role: "user",
          content: userMessage,
        });

      if (userMsgError) throw userMsgError;

      // Get AI response
      const { data, error } = await supabase.functions.invoke("chat-with-analysis", {
        body: {
          analysisId,
          message: userMessage,
          context: analysis?.summary,
        }
      });

      if (error) throw error;

      // Save assistant message
      const { error: assistantMsgError } = await supabase
        .from("chat_messages")
        .insert({
          analysis_id: analysisId,
          user_id: user.id,
          role: "assistant",
          content: data.response,
        });

      if (assistantMsgError) throw assistantMsgError;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages", analysisId] });
      setMessage("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Card className="h-[calc(100vh-12rem)]">
          <CardHeader>
            <CardTitle>{analysis?.title} - Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {isLoading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
              
              {messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <Avatar className="h-8 w-8 bg-primary">
                      <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <Avatar className="h-8 w-8 bg-secondary">
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask a question about this analysis..."
                disabled={sendMessageMutation.isPending}
              />
              <Button
                onClick={handleSend}
                disabled={sendMessageMutation.isPending || !message.trim()}
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Chat;
