import OpenAI from "openai";
import { NextResponse } from "next/server";
import { DiagramResponse } from "@/types/diagram";

export async function POST(req: Request) {
  try {
    const { code, apiKey } = await req.json();

    const key = apiKey || process.env.OPENROUTER_API_KEY;

    if (!key) {
      return NextResponse.json(
        { error: "API Key is required. Please provide it in settings or .env file." },
        { status: 401 }
      );
    }

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: key,
      defaultHeaders: {
        "HTTP-Referer": "https://struckto.ai", // Optional, for OpenRouter rankings
        "X-Title": "Struckto AI", // Optional, for OpenRouter rankings
      }
    });

    const prompt = `
      Analyze the following code and convert each function/method into a structured Nassi-Shneiderman diagram representation (JSON).
      
      Return ONLY valid JSON. No markdown formatting.
      
      The JSON structure should be:
      {
        "diagrams": [
          {
            "title": "Function Name",
            "root": {
              "id": "unique_id",
              "type": "sequence", 
              "children": [ ... ]
            }
          }
        ]
      }

      Node Types:
      - 'sequence': has 'children' (array of nodes)
      - 'statement': has 'text'
      - 'if': has 'condition', 'trueBlock' (array of nodes), 'falseBlock' (array of nodes). IMPORTANT: trueBlock/falseBlock are arrays (sequences).
      - 'loop': has 'condition', 'children' (array of nodes representing the body)
      - 'switch': has 'condition', 'cases' (array of { condition: string, body: DiagramNode }) -- Optional, use if/else if simpler.

      If the code has no functions (just script), treat it as one "Main" function.

      Code to analyze:
      ${code}
    `;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "xiaomi/mimo-v2-flash:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let text = completion.choices[0].message.content || "";
    
    // Clean up markdown if present
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const data: DiagramResponse = JSON.parse(text);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("OpenRouter API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate diagram" },
      { status: 500 }
    );
  }
}
