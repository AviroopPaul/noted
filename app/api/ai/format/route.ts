import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional editor. Your task is to improve the given text by fixing grammar, enhancing clarity, and improving word choice while maintaining the original meaning and tone.",
        },
        {
          role: "user",
          content: `Please improve this text: ${content}`,
        },
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.3,
      max_tokens: 2048,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("No response from AI");
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("AI Format error:", error);
    return NextResponse.json(
      { error: "Failed to format text" },
      { status: 500 }
    );
  }
}
