import { NodeExecutor } from "@/features/lib/types";
import Handlebars from 'handlebars'
import {createOpenAI} from "@ai-sdk/openai"
import {  GeminiChannel } from "@/inngest/channels/gemini";
import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import { OpenaiChannel } from "@/inngest/channels/openai";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;

})

type OpenaiData = {
    variableName?: string;
    model?: string;
    systemPrompt?: string;
    userPrompt?: string;
}


export const OpenaiExecutor: NodeExecutor<OpenaiData> = async({
    data,
    nodeId,
    context,
    step,
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
  const systemPrompt = data.systemPrompt 
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant"
  const userPrompt = Handlebars.compile(data.userPrompt)(context)
  const credentialValue = process.env.OPENAI_API_KEY;
  const openai = createOpenAI({
    apiKey: credentialValue
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