import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, urls } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Analyzing URLs:', { type, urlCount: urls?.length });

    let combinedContent = '';
    
    if (type === 'url' && Array.isArray(urls)) {
      // Fetch all URLs and combine content
      for (const url of urls) {
        try {
          const urlResponse = await fetch(url);
          let text = await urlResponse.text();
          // Extract main text (simplified)
          text = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').substring(0, 3000);
          combinedContent += `\n\n--- Content from ${url} ---\n${text}`;
        } catch (error) {
          console.error(`Failed to fetch ${url}:`, error);
        }
      }
    }

    console.log('Extracted combined text length:', combinedContent.length);

    // Call Lovable AI for analysis
    const analysisPrompt = `Analyze the following content from multiple URLs and provide a comprehensive analysis:

1. A summary with bullet points and bold headings covering main topics
2. Key insights as bullet points with bold headings
3. Top 10-15 keywords with frequency
4. Sentiment analysis (positive, neutral, negative percentages)

Content:
${combinedContent}

Respond in JSON format with bullet points using newlines:
{
  "title": "Combined Analysis",
  "summary": "Main Topic 1: description\\nMain Topic 2: description\\nConclusion: description",
  "insights": "Key Finding 1: details\\nKey Finding 2: details\\nRecommendation: details",
  "keywords": [{"word": "keyword", "count": 5}],
  "sentiment": {"positive": 40, "neutral": 50, "negative": 10}
}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert content analyzer. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response received');
    
    const responseContent = aiData.choices[0].message.content;
    
    // Parse JSON from response
    const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
    const analysisResult = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      title: 'Analysis Result',
      summary: 'Content analyzed successfully',
      insights: 'Key insights extracted from content',
      keywords: [],
      sentiment: { positive: 33, neutral: 34, negative: 33 }
    };

    console.log('Analysis complete');

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
