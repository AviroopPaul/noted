import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  console.log("Received AI request");
  try {
    const { prompt, conversationHistory = [] } = await request.json();
    console.log("Received prompt:", prompt);
    console.log("Conversation history length:", conversationHistory.length);

    if (!prompt) {
      console.log("Error: No prompt provided");
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Convert conversation history to Groq message format and add new prompt
    const messages = [
      ...conversationHistory.map(
        ({ role, content }: { role: string; content: string }) => ({
          role,
          content,
        })
      ),
      {
        role: "user",
        content: prompt,
      },
    ];

    console.log("Making request to Groq API...");
    const completion = await groq.chat.completions.create({
      messages,
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 2048,
    });
    console.log("Received response from Groq API");

    const response = completion.choices[0]?.message?.content;
    console.log("Extracted response:", response?.substring(0, 100) + "...");

    if (!response) {
      console.log("Error: No response content from AI");
      throw new Error("No response from AI");
    }

    // Add the AI's response to the conversation history
    const updatedHistory = [
      ...conversationHistory,
      { role: "user", content: prompt },
      { role: "assistant", content: response },
    ];

    console.log("Returning successful response with updated history");
    return NextResponse.json({
      response,
      conversationHistory: updatedHistory,
    });
  } catch (error) {
    console.error("Groq API error:", error);
    console.log(
      "Request failed with error:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 }
    );
  }
}
