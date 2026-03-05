import { NodeExecutor } from "@/features/lib/types";
import Handlebars from 'handlebars'
import {createGoogleGenerativeAI} from "@ai-sdk/google"
import {  GeminiChannel } from "@/inngest/channels/gemini";
import { generateText } from "ai";
import { NonRetriableError } from "inngest";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;

})

type GeminiData = {
    variableName?: string;
    model?: string;
    systemPrompt?: string;
    userPrompt?: string;
}


export const GeminiExecutor: NodeExecutor<GeminiData> = async({
    data,
    nodeId,
    context,
    step,
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
  const systemPrompt = data.systemPrompt 
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant"
  const userPrompt = Handlebars.compile(data.userPrompt)(context)
  const credentialValue = process.env.GOOGLE_GENERATIVE_AI;
  const google = createGoogleGenerativeAI({
    apiKey: credentialValue
  })
 
  try{
    const { steps } =  await step.ai.wrap(
        "gemini-generate-text",
        generateText,
        {
            model: google(data.model || "gemini-1.5-flash"),
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
            aiResponse: text
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