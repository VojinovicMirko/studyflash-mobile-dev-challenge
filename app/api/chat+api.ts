import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, tool, UIMessage } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: convertToModelMessages(messages),

    tools: {
      weather: tool({
        description: "Get the weather in a location (fahrenheit)",
        inputSchema: z.object({
          location: z.string().describe("The location to get the weather for"),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          const humidity = Math.round(Math.random() * 100);
          const windSpeed = Math.round(Math.random() * 20);
          const condition = ["Sunny", "Cloudy", "Rainy", "Stormy"][
            Math.floor(Math.random() * 4)
          ];
          return {
            location,
            temperature,
            humidity,
            windSpeed,
            condition,
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse({
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "none",
    },
  });
}
