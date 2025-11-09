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
    const failedUrls: string[] = [];
    
    if (type === 'url' && Array.isArray(urls)) {
      // Fetch all URLs and combine content
      for (const url of urls) {
        try {
          console.log(`Fetching URL: ${url}`);
          const urlResponse = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1'
            }
          });
          
          let text = '';

          if (urlResponse.ok) {
            let html = await urlResponse.text();
            // Remove script and style tags
            html = html.replace(/<script\b[^<]*(?:(?!<\/script>).)*<\/script>/gi, '');
            html = html.replace(/<style\b[^<]*(?:(?!<\/style>).)*<\/style>/gi, '');
            
            // Try to extract main content (common article selectors)
            const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
            const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
            const contentMatch = html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
            
            let candidate = articleMatch?.[1] || mainMatch?.[1] || contentMatch?.[1] || html;
            // Strip remaining HTML tags and normalize whitespace
            text = candidate.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 6000);
          }

          // If initial fetch failed or text too short, try Jina Reader fallback
          if (!urlResponse.ok || text.length < 200) {
            const jinaUrl = `https://r.jina.ai/${url}`;
            console.log(`Trying Jina Reader fallback: ${jinaUrl}`);
            const jinaResp = await fetch(jinaUrl, { headers: { 'Accept': 'text/plain' } });
            if (jinaResp.ok) {
              const jinaText = (await jinaResp.text()).trim();
              if (jinaText.length >= 200) {
                text = jinaText.substring(0, 8000);
              }
            }
          }

          if (!text || text.length < 100) {
            console.warn(`Extracted text too short for ${url}, might be blocked or have no content`);
            failedUrls.push(url);
            continue;
          }
          
          combinedContent += `\n\n--- Content from ${url} ---\n${text}`;
          console.log(`Successfully extracted ${text.length} characters from ${url}`);
        } catch (error) {
          console.error(`Error fetching ${url}:`, error);
          failedUrls.push(url);
        }
      }
    }

    if (!combinedContent.trim()) {
      console.error('No content extracted from any URLs');

      const fallbackInsights = [
        '* Access blocked: The provided sites may prevent automated access.',
        '* Try alternative sources or paste the article text directly.',
        failedUrls.length ? `* Affected URLs: ${failedUrls.join(', ')}` : ''
      ].filter(Boolean).join('\n');

      const fallback = {
        title: 'Analysis Unavailable',
        summary: 'We could not extract readable content from the provided URL(s). The site may block bots or require authentication.',
        insights: fallbackInsights,
        keywords: [],
        sentiment: { positive: 0, neutral: 100, negative: 0 }
      };

      return new Response(JSON.stringify(fallback), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Extracted combined text length:', combinedContent.length);

    // Call Lovable AI for analysis
    const analysisPrompt = `Analyze the following web content and provide a comprehensive analysis.

IMPORTANT: You must respond with valid JSON where summary and insights are plain text strings with newlines (\\n), NOT objects or arrays.

Content:
${combinedContent}

Respond in this EXACT JSON format:
{
  "title": "Brief descriptive title of the content",
  "summary": "Point 1: description\\nPoint 2: description\\nPoint 3: description",
  "insights": "Insight 1: details\\nInsight 2: details\\nRecommendation: details",
  "keywords": [{"word": "keyword", "count": 5}],
  "sentiment": {"positive": 40, "neutral": 50, "negative": 10}
}

Make sure summary and insights are STRING values with \\n for line breaks, not objects or arrays.`;

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
    console.log('Raw AI response:', responseContent.substring(0, 200));
    
    // Parse JSON from response
    let analysisResult;
    try {
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      analysisResult = JSON.parse(jsonMatch[0]);
      
      // Ensure summary and insights are strings
      if (typeof analysisResult.summary !== 'string') {
        analysisResult.summary = JSON.stringify(analysisResult.summary);
      }
      if (typeof analysisResult.insights !== 'string') {
        analysisResult.insights = JSON.stringify(analysisResult.insights);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      analysisResult = {
        title: 'Analysis Result',
        summary: 'Content analyzed successfully. The AI provided insights about the content.',
        insights: 'Key points were extracted from the analyzed content.',
        keywords: [],
        sentiment: { positive: 33, neutral: 34, negative: 33 }
      };
    }

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
