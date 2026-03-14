import { createMcpHandler } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// Create your MCP server
const server = new McpServer({
  name: "my-mcp-server",
  version: "1.0.0",
});
// Add tools to your server
server.tool(
  "add_numbers",
  "Add two numbers together",
  { a: { type: "number" }, b: { type: "number" } },
  async (args) => {
    return {
      content: [{ type: "text", text: String(args.a + args.b) }],
    };
  }
);
export default {
  async fetch(request, env, ctx) {
    return createMcpHandler(server)(request, env, ctx);
  },
};

