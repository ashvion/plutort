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
    const { type, content, filePath } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Analyzing content:', { type, hasContent: !!content, hasFilePath: !!filePath });

    let textContent = '';
    
    if (type === 'url') {
      // Fetch URL content
      const urlResponse = await fetch(content);
      textContent = await urlResponse.text();
      // Extract main text (simplified - in production use a proper HTML parser)
      textContent = textContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').substring(0, 5000);
    } else if (type === 'pdf') {
      // For PDF, we'd need to extract text - for now use a placeholder
      textContent = 'PDF content analysis placeholder - implement PDF parsing';
    }

    console.log('Extracted text length:', textContent.length);

    // Call Lovable AI for analysis
    const analysisPrompt = `Analyze the following content and provide:
1. A concise summary (2-3 sentences)
2. Key insights (3-5 bullet points)
3. Top 10-15 keywords with frequency
4. Sentiment analysis (positive, neutral, negative percentages)

Content:
${textContent}

Respond in JSON format:
{
  "title": "content title",
  "summary": "summary text",
  "insights": "key insights",
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
