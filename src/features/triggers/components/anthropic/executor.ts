import { NodeExecutor } from "@/features/lib/types";
import Handlebars from 'handlebars'
import {createAnthropic} from "@ai-sdk/anthropic"
import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import { AnthropicChannel } from "@/inngest/channels/anthropic";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;

})

type AnthropicData = {
    variableName?: string;
    credentialId?: string;
    //model?: string;
    systemPrompt?: string;
    userPrompt?: string;
}


export const AnthropicExecutor: NodeExecutor<AnthropicData> = async({
    data,
    nodeId,
    context,
    step,
    userId,
    publish
}) => {
  await publish(
        AnthropicChannel().status({
        nodeId,
        status: "loading"
    })
  )
  if(!data.variableName) {
    await publish(
        AnthropicChannel().status({
            nodeId,
            status: "error"
        })
    );
    throw new NonRetriableError("Openai node: Variablename is missing")
  }
  if(!data.credentialId) {
    await publish(
        AnthropicChannel().status({
            nodeId,
            status: "error"
        })
    );
    throw new NonRetriableError("Anthropic node: CredentialId is missing")
  }
  const credential = await step.run("get-credential", () => {
    return prisma.credential.findUnique({
        where: {
            id: data.credentialId,
            userId
        }
    })
  })
  if (!credential) {
    throw new NonRetriableError("Anthropic node: Credential not found")
  }
  const systemPrompt = data.systemPrompt 
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant"
  const userPrompt = Handlebars.compile(data.userPrompt)(context)
  const anthropic = createAnthropic({
    apiKey: decrypt(credential.value)
  })
 
  try{
    const { steps } =  await step.ai.wrap(
        "anthropic-generate-text",
        generateText,
        {
            model: anthropic("claude-sonnet-4-0"),
            system: systemPrompt,
            prompt: userPrompt,
            experimental_telemetry: {
                isEnabled: true,
                recordInputs: true,
                recordOutputs: true
            }
        }
    )
    const text = steps[0].content[0].type === "text"
                    ? steps[0].content[0].text : "";
    await publish(
        AnthropicChannel().status({
            nodeId,
            status: "success"
        })
    )
    return {
        ...context,
        [data.variableName]: {
            text
        }
    }
  }catch(error) {
    await publish(
        AnthropicChannel().status({
            nodeId,
            status: "error"
        })
    );
    throw error;
  }
}