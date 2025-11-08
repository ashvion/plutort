import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, MessageSquare } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

interface AnalysisResultProps {
  analysis: {
    id: string;
    title: string;
    summary: string;
    keywords: any;
    sentiment: any;
    insights: string;
  };
}

const AnalysisResult = ({ analysis }: AnalysisResultProps) => {
  const navigate = useNavigate();
  const keywords = Array.isArray(analysis.keywords) ? analysis.keywords : [];
  const sentiment = analysis.sentiment || {};

  const keywordData = keywords.slice(0, 10).map((kw: any) => ({
    name: typeof kw === 'string' ? kw : kw.word,
    count: typeof kw === 'string' ? 1 : kw.count || 1,
  }));

  const sentimentData = [
    { name: 'Positive', value: sentiment.positive || 0, color: 'hsl(var(--chart-4))' },
    { name: 'Neutral', value: sentiment.neutral || 0, color: 'hsl(var(--chart-3))' },
    { name: 'Negative', value: sentiment.negative || 0, color: 'hsl(var(--destructive))' },
  ];

  const handleExportPDF = () => {
    // Create a simple text export for now
    const content = `
Analysis Report: ${analysis.title}

SUMMARY:
${analysis.summary}

INSIGHTS:
${analysis.insights}

KEYWORDS:
${keywords.map((kw: any) => typeof kw === 'string' ? kw : kw.word).join(', ')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${analysis.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{analysis.title}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={() => navigate(`/chat/${analysis.id}`)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Summary</h3>
            <p className="text-muted-foreground">{analysis.summary}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Key Insights</h3>
            <p className="text-muted-foreground">{analysis.insights}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Top Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {keywords.slice(0, 15).map((kw: any, idx: number) => (
                <Badge key={idx} variant="secondary">
                  {typeof kw === 'string' ? kw : kw.word}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Keyword Frequency</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={keywordData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Sentiment Analysis</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResult;
