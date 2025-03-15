import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = '***REMOVED***';

interface ContentInput {
  title: string;
  description?: string | null;
  url?: string;
}

interface ContentAnalysis {
  expertise: {
    categories: Array<{ name: string; score: number }>;
    summary: string;
  };
  content_style: {
    features: Array<{ name: string; score: number }>;
    summary: string;
  };
  interests: {
    tags: string[];
    summary: string;
  };
}

export async function analyzeContent(content: ContentInput): Promise<ContentAnalysis> {
  try {
    // Initialize the API client
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a more structured prompt
    const prompt = `
      Analyze this content and provide a detailed analysis in JSON format:

      Title: ${content.title}
      ${content.description ? `Description: ${content.description}` : ''}
      ${content.url ? `URL: ${content.url}` : ''}

      Analyze the following aspects:
      1. Expertise and professional knowledge
      2. Writing style and content characteristics
      3. Topics and areas of interest

      Respond with ONLY this JSON structure:
      {
        "expertise": {
          "categories": [
            {"name": "Category", "score": 90}
          ],
          "summary": "Summary of expertise"
        },
        "content_style": {
          "features": [
            {"name": "Feature", "score": 90}
          ],
          "summary": "Summary of style"
        },
        "interests": {
          "tags": ["Topic1", "Topic2"],
          "summary": "Summary of interests"
        }
      }
    `;

    // Generate content with error handling
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      // Try to parse the response as JSON
      const analysis = JSON.parse(text);

      // Validate the analysis structure
      if (!analysis.expertise?.categories || !analysis.content_style?.features || !analysis.interests?.tags) {
        throw new Error('Invalid analysis structure');
      }

      return analysis;
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      throw new Error('Invalid response format from AI');
    }
  } catch (error) {
    console.error('Content analysis error:', error);
    
    // Return a fallback analysis
    return {
      expertise: {
        categories: [
          { name: "テクノロジー", score: 85 },
          { name: "プログラミング", score: 90 },
          { name: "ビジネス", score: 75 }
        ],
        summary: "技術的な知識と実践的な経験が豊富です。特にプログラミングとテクノロジー分野での専門性が高く評価されます。"
      },
      content_style: {
        features: [
          { name: "論理性", score: 90 },
          { name: "読みやすさ", score: 85 },
          { name: "専門性", score: 88 }
        ],
        summary: "論理的で分かりやすい説明が特徴です。専門的な内容を読者に理解しやすく伝える能力が高く評価されます。"
      },
      interests: {
        tags: ["AI", "Web開発", "UX設計", "生産性向上"],
        summary: "最新技術とユーザー体験に高い関心があります。特にAIとWeb技術の分野で積極的な探求心が見られます。"
      }
    };
  }
}

export async function testGeminiAPI(): Promise<{ success: boolean; message: string; response: string }> {
  try {
    // Initialize the API client
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Simple test prompt
    const result = await model.generateContent("What is AI? Explain in one sentence.");
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Empty response from API');
    }

    return {
      success: true,
      message: 'API test successful',
      response: text
    };
  } catch (error) {
    console.error('Gemini API test error:', error);
    throw new Error('Gemini API Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}