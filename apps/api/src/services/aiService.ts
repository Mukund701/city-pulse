// apps/api/src/services/aiService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google AI client with the API key from our .env file
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

// Define a type for the expected Event structure for type safety
export interface AiEvent {
  title: string;
  description: string;
  // Ensure these categories match your Prisma Enum
  category: 'CULTURAL' | 'SPORTS' | 'BUSINESS' | 'TECHNOLOGY' | 'ENTERTAINMENT' | 'EDUCATION' | 'HEALTH' | 'ENVIRONMENT' | 'OTHER';
  location: string;
}

export async function findEventsForCity(cityName: string, countryName: string): Promise<AiEvent[]> {
  try {
    // We use the gemini-1.5-flash model for its speed and capability
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // This is the prompt we send to the AI. It's very specific to force a structured JSON response.
    const prompt = `
      List between 3 and 5 upcoming public events in ${cityName}, ${countryName} happening in the next 3 months.
      Events can be related to technology, culture, sports, or business.
      You must respond ONLY with a valid JSON array of objects. Do not include any text, explanation, or markdown formatting before or after the JSON array.
      Each object in the array must have the following keys: "title" (string), "description" (string, max 150 characters), "category" (a single valid uppercase enum value from CULTURAL, SPORTS, BUSINESS, TECHNOLOGY, ENTERTAINMENT, EDUCATION, HEALTH, ENVIRONMENT, OTHER), and "location" (string).
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();
    
    // The AI might wrap the JSON in markdown backticks. This code extracts the raw JSON string.
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      text = jsonMatch[0];
    }
    
    // Now, parse the cleaned text
    const events: AiEvent[] = JSON.parse(text);
    return events;

  } catch (error) {
    console.error('Error fetching events from AI service:', error);
    // If the AI fails or returns invalid JSON, we'll throw an error to be handled by our API endpoint.
    throw new Error('Failed to parse events from AI service.');
  }
}