
import { GoogleGenAI, Type } from "@google/genai";
import { Task } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateProjectTasks(prompt: string): Promise<Task[]> {
  try {
    const response = await ai.models.generateContent({
      // Use gemini-3-pro-preview for complex reasoning tasks like project scheduling
      model: "gemini-3-pro-preview",
      contents: `You are a professional Project Manager. Create a comprehensive project schedule for: "${prompt}".
      
      Requirements:
      1. Provide between 10 to 15 activities.
      2. Tasks must follow a logical sequence (waterfall or agile).
      3. For each activity, define:
         - activity: A clear, professional name.
         - planStart: The starting period (range 1-50).
         - planDuration: Expected work days (range 1-12).
         - actualStart: When it really started (often same as planStart, or slightly delayed).
         - actualDuration: How long it actually took (range 1-15).
         - percentComplete: Progress (range 0-100).
      4. Ensure task dependencies are reflected in the start times.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              activity: { type: Type.STRING },
              planStart: { type: Type.INTEGER },
              planDuration: { type: Type.INTEGER },
              actualStart: { type: Type.INTEGER },
              actualDuration: { type: Type.INTEGER },
              percentComplete: { type: Type.INTEGER },
            },
            required: ["id", "activity", "planStart", "planDuration", "actualStart", "actualDuration", "percentComplete"],
          },
        },
      },
    });

    const jsonStr = response.text.trim();
    // Add unique IDs if the model didn't provide good ones
    const parsed = JSON.parse(jsonStr) as Task[];
    return parsed.map((t, index) => ({
      ...t,
      id: t.id || `gen-${Date.now()}-${index}`
    }));
  } catch (error) {
    console.error("Error generating tasks:", error);
    throw error;
  }
}
