import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

function errorHandler(error: unknown) {
  console.log(error);
  if (error == null) {
    return 'unknown error';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return JSON.stringify(error);
}

const openai = createOpenAI({
  baseURL: "https://doi9.top/v1/",
//   apiKey: .env.local => OPENAI_API_KEY=sk-xxx
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gemini-2.5-pro-exp-03-25"),
    messages,
  });

  return result.toDataStreamResponse({
    getErrorMessage: errorHandler,
  });
}
