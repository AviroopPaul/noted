import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  console.log("Received AI request");
  try {
    const { prompt } = await request.json();
    console.log("Received prompt:", prompt);

    if (!prompt) {
      console.log("Error: No prompt provided");
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    console.log("Making request to Groq API...");
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
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

    console.log("Returning successful response");
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Groq API error:", error);
    console.log("Request failed with error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 }
    );
  }
}
