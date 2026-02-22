import { inngest } from "./client";
import { generateText } from "ai";


export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  { event: "workflows/execute.workflow" },
  async ({ event, step }) => {
    await step.sleep("test", "5s")
  }
)
   