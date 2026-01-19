import { inngest } from "@/inngest/client";
import { serve } from "inngest/next";
import { helloWorld } from "@/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    /* your functions will be passed here later! */
  ],
});