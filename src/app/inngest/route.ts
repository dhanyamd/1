import { inngest } from "@/inngest/client";
import { serve } from "inngest/next";
import prisma from "@/lib/db";
import {executeWorkflow} from "@/inngest/functions"

export const helloWorld = inngest.createFunction(
  {id: "hello-world"},
  {event: "test/hello.world"},
  async ({event, step}) => {
    await step.sleep("fetching", "5s");

    await step.sleep("transcribing", "5s")
    await step.sleep("sending-to-ai", "5s")

    await step.run("create-workflow", () => {
      return prisma.workflow.create({
        //@ts-ignore
        data: {
          name : "workflow-from-inngest"
        },
      });
    });
  }
)
// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    executeWorkflow
    /* your functions will be passed here later! */
  ],
});