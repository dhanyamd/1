import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "my-app",
  // Inngest will try to read INNGEST_EVENT_KEY from environment variables
  // For development, you might not need this if using the dev server
});