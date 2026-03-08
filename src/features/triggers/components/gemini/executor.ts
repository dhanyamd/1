import { NodeExecutor } from "@/features/lib/types";
import Handlebars from 'handlebars'
import {createGoogleGenerativeAI} from "@ai-sdk/google"
import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import prisma from "@/lib/db";
import { GeminiChannel } from "@/inngest/channels/gemini";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;

})

type GeminiData = {
    variableName?: string;
    credentialId?: string;
    //model?: string;
    systemPrompt?: string;
    userPrompt?: string;
}


export const GeminiExecutor: NodeExecutor<GeminiData> = async({
    data,
    nodeId,
    context,
    step,
    userId,
    publish
}) => {
  await publish(
        GeminiChannel().status({
        nodeId,
        status: "loading"
    })
  )
  if(!data.variableName) {
    await publish(
        GeminiChannel().status({
            nodeId,
            status: "error"
        })
    );
    throw new NonRetriableError("Gemini node: Variablename is missing")
  }
  if(!data.credentialId) {
    await publish(
        GeminiChannel().status({
            nodeId,
            status: "error"
        })
    );
    throw new NonRetriableError("Gemini node: CredentialId is missing")
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
  }
  const google = createGoogleGenerativeAI({
    apiKey: credential.value
  })
 
  try{
    const { steps } =  await step.ai.wrap(
        "gemini-generate-text",
        generateText,
        {
            model: google("gemini-2.0-flash"),
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
        GeminiChannel().status({
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
        GeminiChannel().status({
            nodeId,
            status: "error"
        })
    );
    throw error;
  }
}