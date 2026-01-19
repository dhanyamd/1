import prisma from "@/lib/db";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import {createOpenAI} from "@ai-sdk/openai"
import { createAnthropic} from "@ai-sdk/anthropic"


const google = createGoogleGenerativeAI()
const anthropic = createAnthropic()
const openai = createOpenAI()
export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    const {steps: geministeps} = await step.ai.wrap(
      "gemini-generate-text",
      generateText, {
        model: google("gemini-2.5-flash"),
        system: "you are a helpful assistant",
        prompt: "what is 2+2?",
      }
    ); 
    const {steps: openaisteps} = await step.ai.wrap(
      "openai-generate-text",
      generateText, {
        model: openai("gpt-4o"),
        system: "you are a helpful assistant",
        prompt: "what is 2+2?",
    }
  ); 
  const {steps: anthropicsteps} = await step.ai.wrap(
    "anthropic-generate-text",
    generateText, {
      model: anthropic("claude-opus-4-1"),
      system: "you are a helpful assistant",
      prompt: "what is 2+2?",
  }
); 
  return {
    geministeps,
    openaisteps,
    anthropicsteps
  }
  },
);
   