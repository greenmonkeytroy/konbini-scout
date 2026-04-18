import { httpRouter } from "convex/server";

const http = httpRouter();

// Clerk webhook is handled via Next.js API route (/api/clerk-webhook)
// because it needs access to the Convex client with mutations.
// Add any Convex HTTP routes here if needed in later phases.

export default http;
