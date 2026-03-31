/**
 * Register Blackbox AI Query Code Tool
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { BlackboxAIClient } from './blackbox_client.js';
import { executeQueryCode } from './query_code.js';

export function registerQueryCodeTool(
  server: McpServer,
  client: BlackboxAIClient
): void {
  server.registerTool(
    'blackbox_query_code',
    {
      title: 'Query Code with Blackbox AI',
      description:
        'Search for code snippets across Blackbox AI\'s indexed repositories. ' +
        'Useful for finding implementations, patterns, and code examples.',
      outputSchema: {
        result: z.string().describe('Code search results'),
      },
    },
    async (params: Record<string, unknown>) => {
      const result = await executeQueryCode(client, params);
      return {
        content: [
          {
            type: 'text',
            text: result,
          },
        ],
        structuredContent: {
          result,
        },
      };
    }
  );
}
