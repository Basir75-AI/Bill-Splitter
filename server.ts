import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limits for base64 image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy init Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please add it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Simple base64 data URL parser helper
function parseBase64Image(dataUrl: string) {
  const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return {
      mimeType: "image/jpeg",
      data: dataUrl,
    };
  }
  return {
    mimeType: matches[1],
    data: matches[2],
  };
}

// 1. Receipt Parsing Endpoint
app.post("/api/parse-receipt", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Missing 'image' parameter." });
    }

    const { mimeType, data } = parseBase64Image(image);
    const ai = getGeminiClient();

    const prompt = `Analyze this receipt image and extract its merchant name, items, subtotal, tax amount, tip amount (if of interest/printed, otherwise default to 0), and total.
Follow these rules strictly:
1. Extract all line items clearly. Each line item must have a name, price (the total price for that line as represented on receipt), and quantity (default to 1 if not readable or visible).
2. If multiple quantities of an item exist (e.g. 3 Tacos for $9.00), list the item name as "Taco", quantity: 3, and price as 9.00 (the cumulative price for that item line).
3. Extract any tax printed; if not found or unclear, put 0.
4. Extract any tip or service charge printed; if not found, put 0.
5. If subtotal is not explicitly printed, calculate it as the sum of all item prices.
6. Make sure total matches subtotal + tax + tip (or as close to the receipt total as possible).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType,
            data,
          },
        },
        {
          text: prompt,
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchant: {
              type: Type.STRING,
              description: "Name of the restaurant or store, e.g., 'Joe's Grill'. Default to 'Receipt' if unknown.",
            },
            items: {
              type: Type.ARRAY,
              description: "List of individual purchased items on the receipt.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of the item." },
                  price: { type: Type.NUMBER, description: "Cumulative price for this item (original line price)." },
                  quantity: { type: Type.INTEGER, description: "Quantity of this item." },
                },
                required: ["name", "price", "quantity"],
              },
            },
            subtotal: { type: Type.NUMBER, description: "The subtotal of items before tax and tip." },
            tax: { type: Type.NUMBER, description: "The tax amount." },
            tip: { type: Type.NUMBER, description: "The tip or service charge amount." },
            total: { type: Type.NUMBER, description: "The final total amount on the receipt." },
          },
          required: ["merchant", "items", "subtotal", "tax", "tip", "total"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini parsing models.");
    }

    const parsedData = JSON.parse(resultText.trim());

    // Inject unique IDs for the items so the client can reference them securely
    if (parsedData.items && Array.isArray(parsedData.items)) {
      parsedData.items = parsedData.items.map((item: any, idx: number) => ({
        id: `item-${idx}-${Date.now()}`,
        name: item.name || `Item ${idx + 1}`,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
      }));
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error("Receipt parsing error:", error);
    return res.status(500).json({ error: error.message || "Failed to parse receipt image." });
  }
});

// 2. Smart Cost Assignment Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, items, assignments, people, tax, tip } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Missing 'message' parameter." });
    }

    const ai = getGeminiClient();

    const subtotal = items.reduce((sum: number, it: any) => sum + (Number(it.price) || 0), 0);

    const prompt = `The user is typing a command to assign costs or modify the splitting of a bill.
Your job is to parse this natural language request and map it to updates in who owes what.

We have:
- Receipt items: ${JSON.stringify(items)}
- Current people list: ${JSON.stringify(people)}
- Current assignments (dictionary mapping item ID to array of people names assigned to it): ${JSON.stringify(assignments)}
- Current tax: $${tax}
- Current tip: $${tip}
- Total items subtotal: $${subtotal}

User's prompt: "${message}"

Based on the User's prompt:
1. Identify any names mentioned. If they are not in the current people list, add them to updatedPeople. Do not delete existing people unless the user asks to remove them (e.g. "remove Sue").
2. Match item titles or item concepts to our receipt items. Match them semantically (e.g., "burger" matches "Cheeseburger Deluxe").
3. Update assignments:
   - If the user assigns an item ("Dhruv had the tacos" OR "tacos go to Dhruv"), then the matching item should be assigned to Dhruv. When doing a direct assignment like this, replace any prior assignments for that specific item unless they say "also Dhruv" or "split the tacos WITH Dhruv".
   - If the user splits an item ("Sarah and Sue split the pizza" OR "Sarah and Sue shared the pizza"), set the matching item's assigned people list to exactly ["Sarah", "Sue"].
   - For additional splitting ("split nachos with Bob"), append Bob to the list of persons assigned to nachos.
   - If user says "unassign nachos", wipe out assignments for nachos.
   - If user says "clear all", set all items' assignments to empty.
   - If user says "Dhruv is paying for everything", assign Dhruv to ALL items in the receipt.
4. Update tax or tip if they mention total modifications. If they say "add a 15% tip", calculate 15% of the items subtotal ($${subtotal}) and output it as updatedTip. If they say "tip is $10", output 10 as updatedTip. Do the same for tax.
5. Create a warm, friendly, professional reply confirming exactly what updates were made in a conversational tone. Do not include technical terms (like item-id codes, variables, or json) in the reply text. Mention exact names and item names they assigned, and perhaps what they owe before tax and tip!

Ensure output meets the specified JSON schema. Convert assignments back to an array of { itemId: string, people: string[] }.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            updatedPeople: {
              type: Type.ARRAY,
              description: "The complete updated list of people involved in splitting the receipt.",
              items: { type: Type.STRING }
            },
            updatedAssignments: {
              type: Type.ARRAY,
              description: "The complete updated assignments. For every item, provide the full list of people assigned, including unmodified ones.",
              items: {
                type: Type.OBJECT,
                properties: {
                  itemId: { type: Type.STRING, description: "ID of the receipt item." },
                  people: {
                    type: Type.ARRAY,
                    description: "List of names of people sharing this item. Empty if unassigned.",
                    items: { type: Type.STRING }
                  }
                },
                required: ["itemId", "people"]
              }
            },
            updatedTax: {
              type: Type.NUMBER,
              description: "The updated tax value. If not modified, return the current tax."
            },
            updatedTip: {
              type: Type.NUMBER,
              description: "The updated tip value. If not modified, return the current tip."
            },
            reply: {
              type: Type.STRING,
              description: "A summary message of the updates in a warm, helpful, natural voice."
            }
          },
          required: ["updatedPeople", "updatedAssignments", "updatedTax", "updatedTip", "reply"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini chat helper.");
    }

    const payload = JSON.parse(resultText.trim());

    // Map the array-based updatedAssignments back into our fastAssignments map
    const newAssignments: { [key: string]: string[] } = {};
    
    // First fill with existing assignments to preserve safety
    for (const key of Object.keys(assignments)) {
      newAssignments[key] = [...assignments[key]];
    }

    // Now overlay updates from Gemini
    if (payload.updatedAssignments && Array.isArray(payload.updatedAssignments)) {
      payload.updatedAssignments.forEach((assign: any) => {
        newAssignments[assign.itemId] = assign.people || [];
      });
    }

    return res.json({
      updatedPeople: payload.updatedPeople,
      updatedAssignments: newAssignments,
      updatedTax: Number(payload.updatedTax) || 0,
      updatedTip: Number(payload.updatedTip) || 0,
      reply: payload.reply
    });
  } catch (error: any) {
    console.error("Chat parsing error:", error);
    return res.status(500).json({ error: error.message || "Failed to process natural language splitting command." });
  }
});

// Setup Vite & static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
