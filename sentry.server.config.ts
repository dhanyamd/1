// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://e4eee987a66964367a4b3f6a98278ed3@o4507366809665536.ingest.us.sentry.io/4510747486846976",
 // Import with `import * as Sentry from "@sentry/nextjs"` if you are using ESM
  integrations: [
    Sentry.vercelAIIntegration({
      recordInputs: true,
      recordOutputs: true
    }),
  ],
  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,
  debug: false,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
