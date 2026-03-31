/**
 * Register Blackbox AI Ask Tool
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { BlackboxAIClient } from './blackbox_client.js';
import { executeAskBlackbox } from './ask_blackbox.js';

export function registerAskBlackboxTool(
  server: McpServer,
  client: BlackboxAIClient
): void {
  server.registerTool(
    'blackbox_ask',
    {
      title: 'Ask Blackbox AI',
      description:
        'Ask a question to Blackbox AI and get code generation, explanations, or programming assistance. ' +
        'Great for code generation, debugging, and learning.',
      outputSchema: {
        answer: z.string().describe('Response from Blackbox AI'),
      },
    },
    async (params: Record<string, unknown>) => {
      const result = await executeAskBlackbox(client, params);
      return {
        content: [
          {
            type: 'text',
            text: result,
          },
        ],
        structuredContent: {
          answer: result,
        },
      };
    }
  );
}
