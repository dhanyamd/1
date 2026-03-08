import { NodeExecutor } from "@/features/lib/types";
import Handlebars from 'handlebars'
import {createGoogleGenerativeAI} from "@ai-sdk/google"
import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import prisma from "@/lib/db";
import { DiscordChannel } from "@/inngest/channels/discord";
import { decode } from "punycode";
import ky from "ky";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;

})

type DiscordData = {
    variableName?: string;
    webhookUrl? : string;
    content?: string;
    username?: string;
}


export const DiscordExecutor: NodeExecutor<DiscordData> = async({
    data,
    nodeId,
    context,
    step,
    publish
}) => {
  await publish(
        DiscordChannel().status({
        nodeId,
        status: "loading"
    })
  )
 
  const rawContent = Handlebars.compile(data.content)(context)
  const content = decode(rawContent)
  const username = data.username 
        ? decode(Handlebars.compile(data.username)(context))
        : undefined
  const result = await step.run("discord-webhook", async () => {
    await ky.post(data.webhookUrl!, {
      json: {
        content: content.slice(0, 2000),
        username
      }
    })
    if(!data.webhookUrl) {
      await publish(
          DiscordChannel().status({
              nodeId,
              status: "error"
          })
      );
      throw new NonRetriableError("Discord node: webhook url is missing")
    }
    if(!data.variableName) {
      await publish(
          DiscordChannel().status({
              nodeId,
              status: "error"
          })
      );
      throw new NonRetriableError("Discord node: Variablename is missing")
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
        DiscordChannel().status({
            nodeId,
            status: "success"
        })
    )
    return result;
  }catch(error) {
    await publish(
        DiscordChannel().status({
            nodeId,
            status: "error"
        })
    );
    throw error;
  }
}