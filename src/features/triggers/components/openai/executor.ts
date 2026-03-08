import { NodeExecutor } from "@/features/lib/types";
import Handlebars from 'handlebars'
import {createOpenAI} from "@ai-sdk/openai"
import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import { OpenaiChannel } from "@/inngest/channels/openai";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;

})

type OpenaiData = {
    variableName?: string;
    credentialId? : string;
    //model?: string;
    systemPrompt?: string;
    userPrompt?: string;
}


export const OpenaiExecutor: NodeExecutor<OpenaiData> = async({
    data,
    nodeId,
    context,
    step,
    userId,
    publish
}) => {
  await publish(
        OpenaiChannel().status({
        nodeId,
        status: "loading"
    })
  )
  if(!data.variableName) {
    await publish(
        OpenaiChannel().status({
            nodeId,
            status: "error"
        })
    );
    throw new NonRetriableError("Openai node: Variablename is missing")
  }
  if(!data.credentialId) {
    await publish(
        OpenaiChannel().status({
            nodeId,
            status: "error"
        })
    );
    throw new NonRetriableError("Openai node: Credentials is missing")
  }
  const systemPrompt = data.systemPrompt 
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant"
  const userPrompt = Handlebars.compile(data.userPrompt)(context)
  const credential = await step.run("get-credential", () => {
    return prisma.credential.findUnique({
        where: {
            id: data.credentialId,
            userId
        }
    })
  })
  if (!credential) {
    throw new NonRetriableError("Gemini node: Credential not found")
  }  const openai = createOpenAI({
    apiKey: decrypt(credential.value)
  })
 
  try{
    const { steps } =  await step.ai.wrap(
        "openai-generate-text",
        generateText,
        {
            model: openai("gpt-4o-mini"),
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
        OpenaiChannel().status({
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
        OpenaiChannel().status({
            nodeId,
            status: "error"
        })
    );
    throw error;
  }
}