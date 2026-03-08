import { NodeExecutor } from "@/features/lib/types";
import Handlebars from 'handlebars'
import {createGoogleGenerativeAI} from "@ai-sdk/google"
import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import prisma from "@/lib/db";
import { SlackChannel } from "@/inngest/channels/slack";
import { decode } from "punycode";
import ky from "ky";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;

})

type SlackData = {
    variableName?: string;
    webhookUrl? : string;
    content?: string;
}


export const SlackExecutor: NodeExecutor<SlackData> = async({
    data,
    nodeId,
    context,
    step,
    publish
}) => {
  await publish(
        SlackChannel().status({
        nodeId,
        status: "loading"
    })
  )
  if(!data.content){
    await publish(
      SlackChannel().status({
        nodeId,
        status: "error"
      })
    )
  }
  const rawContent = Handlebars.compile(data)(context);
  const content = decode(rawContent)
  const result = await step.run("slack-webhook", async () => {
    if(!data.webhookUrl) {
      await publish(
          SlackChannel().status({
              nodeId,
              status: "error"
          })
      );
      throw new NonRetriableError("Slack node: webhook url is missing")
    }
    await ky.post(data.webhookUrl!, {
      json: {
        content: content
      }
    })
    
    if(!data.variableName) {
      await publish(
          SlackChannel().status({
              nodeId,
              status: "error"
          })
      );
      throw new NonRetriableError("Slack node: Variablename is missing")
    }
    return {
      ...context,
      [data.variableName]: {
        messageContent: content.slice(0, 2000)
      }
    }
  })
  try{
  
    await publish(
        SlackChannel().status({
            nodeId,
            status: "success"
        })
    )
    return result;
  }catch(error) {
    await publish(
        SlackChannel().status({
            nodeId,
            status: "error"
        })
    );
    throw error;
  }
}