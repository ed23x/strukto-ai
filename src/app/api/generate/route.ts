import OpenAI from "openai";
import { NextResponse } from "next/server";
import { DiagramResponse } from "@/types/diagram";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { code, apiKey } = await req.json();
    
    // 1. Compute Hash
    const hash = crypto.createHash('sha256').update(code).digest('hex');

    // 2. Check Cache (Database)
    let diagramEntry = await prisma.diagramEntry.findUnique({
      where: { hash },
    });

    let data: DiagramResponse;

    if (diagramEntry) {
      console.log("Cache HIT: Returning stored diagram");
      data = diagramEntry.json as unknown as DiagramResponse;
    } else {
      console.log("Cache MISS: Calling AI");
      // 3. Call AI
      const key = apiKey || process.env.OPENROUTER_API_KEY;
      if (!key) {
         return NextResponse.json(
          { error: "API Key is required." },
          { status: 401 }
        );
      }

      const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: key,
        defaultHeaders: {
          "HTTP-Referer": "https://struckto.ai",
          "X-Title": "Struckto AI",
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
        model: "xiaomi/mimo-v2-flash:free",
        messages: [{ role: "user", content: prompt }],
      });

      let text = completion.choices[0].message.content || "";
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      data = JSON.parse(text);

      // Save to DB
      diagramEntry = await prisma.diagramEntry.create({
        data: {
          hash,
          code,
          json: JSON.stringify(data)
        }
      });
    }

    // 4. Link to User (if logged in)
    // const userId = await getUserId(req);
    // if (userId && diagramEntry) {
    //    // Check if already saved
    //    const existingLink = await prisma.userSavedDiagram.findUnique({
    //      where: {
    //        userId_diagramId: {
    //          userId,
    //          diagramId: diagramEntry.id
    //        }
    //      }
    //    });

    //    if (!existingLink) {
    //      await prisma.userSavedDiagram.create({
    //        data: {
    //          userId,
    //          diagramId: diagramEntry.id
    //        }
    //      });
    //      console.log(`Auto-saved diagram ${diagramEntry.id} for user ${userId}`);
    //    }
    // }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Generate Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate diagram";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}