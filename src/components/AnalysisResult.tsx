import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface AnalysisResultProps {
  analysis: {
    title: string;
    summary: string;
    keywords: any;
    sentiment: any;
    insights: string;
  };
}

const AnalysisResult = ({ analysis }: AnalysisResultProps) => {
  const keywords = Array.isArray(analysis.keywords) ? analysis.keywords : [];

  const handleExportPDF = () => {
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
    a.download = `analysis-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Format summary into bullet points with bold headings
  const formatSummary = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map((line, idx) => {
      // Check if line contains a colon (likely a heading)
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0 && colonIndex < 50) {
        const heading = line.substring(0, colonIndex);
        const content = line.substring(colonIndex + 1);
        return (
          <li key={idx} className="mb-2">
            <strong className="text-foreground">{heading}:</strong>
            <span className="text-muted-foreground">{content}</span>
          </li>
        );
      }
      return (
        <li key={idx} className="mb-2 text-muted-foreground">
          {line}
        </li>
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{analysis.title}</CardTitle>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-3">Summary</h3>
          <ul className="list-disc list-inside space-y-1">
            {formatSummary(analysis.summary)}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-3">Key Insights</h3>
          <ul className="list-disc list-inside space-y-1">
            {formatSummary(analysis.insights)}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-3">Top Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {keywords.slice(0, 15).map((kw: any, idx: number) => (
              <Badge key={idx} variant="secondary">
                {typeof kw === 'string' ? kw : kw.word}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisResult;
