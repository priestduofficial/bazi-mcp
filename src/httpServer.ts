import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import { apiRouter } from './api/routes.js';
import { server } from './mcp.js';

const app = express();
app.use(express.json());
app.use(apiRouter);

app.post('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  res.on('close', () => {
    transport.close();
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const port = parseInt(process.env.PORT || '3000');
app
  .listen(port, () => {
    console.log(`BaZi API is running on http://localhost:${port}`);
    console.log(`MCP is running on http://localhost:${port}/mcp`);
  })
  .on('error', (error) => {
    console.error('Server error', error);
    process.exit(1);
  });
