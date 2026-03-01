import { NodeExecutor } from "@/features/lib/types";
import { NonRetriableError } from "inngest";
import ky, {type Options as KyOptions} from 'ky'
import Handlebars from 'handlebars'

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;

})

type HttpRequestData = {
    variableName?: string;
    endpoint : string;     
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
}


export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async({
    data,
    nodeId,
    context,
    step
}) => {
  if (!data.endpoint){
        throw new NonRetriableError("HTTP Request node: No endpoint configured")
    }
  if (!data.variableName){
        throw new NonRetriableError("Variablename not configured")
    }
  if (!data.method){
        throw new NonRetriableError("method not configured")
    }
  const result = await step.run("http-request", async () => {
    
    const endpoint = Handlebars.compile(data.endpoint)(context);
    const method = data.method || "GET";
    const options: KyOptions = {method}
    if(["POST", "PUT", "PATCH"].includes(method)){
            const resolved = Handlebars.compile(data.body || "{}")(context);
            JSON.parse(resolved)
            options.body = data.body;
            options.headers = {
                "Content-Type": "application/json"
            }
    }
    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
                        ? await response.json() 
                        : await response.text()
    const responsePayload = {
        httpResponse: {
            status: response.status,
            statusText: response.statusText,
            data: responseData
        }
    }
  
    if(data.variableName){
        return {
            ...context,
            [data.variableName]: responsePayload
        }
    }
    return {
        ...context,
        ...responsePayload
    }

})
  return result
}


