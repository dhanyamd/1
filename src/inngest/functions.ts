import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { generateText } from "ai";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { ExecutionStatus, NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/features/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualRequestChannel } from "./channels/manual-request";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { OpenaiChannel } from "./channels/openai";
import { AnthropicChannel } from "./channels/anthropic";
import { GeminiChannel } from "./channels/gemini";
import { DiscordChannel } from "./channels/discord";
import { SlackChannel } from "./channels/slack";


export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow",
    retries: process.env.NODE_ENV === "production" ? 3 : 0,
    onFailure: async ({event, step}) => {
      return prisma.execution.update({
        where: {inngestEventId: event.data.event.id},
        data: {
          status: ExecutionStatus.FAILED,
          error: event.data.error.message,
          errorStack: event.data.error.stack
        }
      })
    }
  },
  { event: "workflows/execute.workflow" , 
    channels: [
      httpRequestChannel(),
      manualRequestChannel(),
      googleFormTriggerChannel(),
      GeminiChannel(),
      OpenaiChannel(),
      AnthropicChannel(),
      DiscordChannel(),
      SlackChannel()
    ]
  },
  async ({ event, step, publish }) => {
    const inngestEventId = event.id;
    const workflowId = event.data.workflowId;
    if(!workflowId || !inngestEventId) {
      throw new NonRetriableError("WorkflowID is missing")
    }
    await step.run("create-execution", async () => {
      return prisma.execution.create({
        //@ts-ignore
        data: {
          workflowId,
          inngestEventId
        }
      })
    })
    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {id: workflowId},
        include: {
          nodes: true,
          connections: true,
        }
      });
      return topologicalSort(workflow.nodes, workflow.connections)
    });
    const userId = await step.run("find-user-id", async() => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId},
        select: {
          userId: true
        },
      })
      return workflow.userId
    })
    let context = event.data.initialData || {};
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType)
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
        userId,
        publish 
      })
    }
    await step.run("update-context", async () => {
      return prisma.execution.update({
        where: {inngestEventId, workflowId},
        data: {
          status: ExecutionStatus.SUCCESS,
          completedAt: new Date(),
          output: context
        }
      })
    })
    return {
      workflowId,
      result: context
    }
  }
)
   