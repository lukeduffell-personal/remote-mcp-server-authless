import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WorkerTransport } from "@modelcontextprotocol/sdk/server/workerTransport.js";
import { z } from "zod";
// Define our MCP server with tools
function createServer() {
  const server = new McpServer({
    name: "Authless Calculator",
    version: "1.0.0",
  });
  // Simple addition tool
  server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }],
  }));
  // Calculator tool with multiple operations
  server.tool(
    "calculate",
    {
      operation: z.enum(["add", "subtract", "multiply", "divide"]),
      a: z.number(),
      b: z.number(),
    },
    async ({ operation, a, b }) => {
      let result: number;
      switch (operation) {
        case "add":
          result = a + b;
          break;
        case "subtract":
          result = a - b;
          break;
        case "multiply":
          result = a * b;
          break;
        case "divide":
          if (b === 0)
            return {
              content: [
                {
                  type: "text",
                  text: "Error: Cannot divide by zero",
                },
              ],
            };
          result = a / b;
          break;
      }
      return { content: [{ type: "text", text: String(result) }] };
    },
  );
  return server;
}
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const server = createServer();
    const transport = new WorkerTransport({ 
      enableJsonResponse: true, // Disable SSE streaming, use JSON instead
    });
    server.connect(transport);
    return transport.handleRequest(request);
  },
};
