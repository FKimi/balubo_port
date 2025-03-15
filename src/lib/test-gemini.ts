import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = '***REMOVED***';

export async function testGeminiAPI() {
  try {
    // Initialize the API client
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Simple test prompt
    const result = await model.generateContent("What is artificial intelligence?");
    const response = await result.response;
    const text = response.text();
    
    return {
      success: true,
      message: 'API test successful',
      response: text
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Gemini API Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}