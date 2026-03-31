/**
 * Blackbox AI Code Query Tool
 * Search and query code across Blackbox's indexed repositories
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BlackboxAIClient } from './blackbox_client.js';
import { BlackboxCodeSearchRequest } from './schemas/blackbox.js';

export function createQueryCodeTool(client: BlackboxAIClient): Tool {
  return {
    name: 'blackbox_query_code',
    description:
      'Search for code snippets across Blackbox AI\'s indexed repositories. ' +
      'Useful for finding implementations, patterns, and code examples.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The code search query (e.g., "async function", "error handling")',
        },
        language: {
          type: 'string',
          description: 'Programming language filter (e.g., "typescript", "python", "javascript")',
          enum: [
            'typescript',
            'javascript',
            'python',
            'java',
            'go',
            'rust',
            'csharp',
            'php',
            'ruby',
            'cpp',
            'c',
          ],
        },
        repository: {
          type: 'string',
          description: 'Optional specific repository to search within',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default: 10, max: 50)',
          minimum: 1,
          maximum: 50,
        },
      },
      required: ['query'],
    },
  };
}

/**
 * Execute code query tool
 */
export async function executeQueryCode(
  client: BlackboxAIClient,
  params: Record<string, unknown>
): Promise<string> {
  const query = params.query as string | undefined;
  const language = params.language as string | undefined;
  const repository = params.repository as string | undefined;
  const limit = typeof params.limit === 'number' ? params.limit : 10;

  if (!query || typeof query !== 'string') {
    throw new Error('Query parameter is required and must be a string');
  }

  const request: BlackboxCodeSearchRequest = {
    query,
    ...(language && { language }),
    ...(repository && { repository }),
    limit: Math.min(Math.max(limit, 1), 50),
  };

  const results = await client.searchCode(request);

  if (results.length === 0) {
    return `No code snippets found for query: "${query}"`;
  }

  const formatted = results
    .map(
      (result, index) =>
        `\n## Result ${index + 1}\n` +
        `**Repository:** ${result.repository}\n` +
        `**File:** ${result.file} (${result.language})\n` +
        `**Line:** ${result.lineNumber}\n` +
        `**URL:** ${result.url}\n` +
        '```\n' +
        result.snippet +
        '\n```\n'
    )
    .join('\n---\n');

  return `Found ${results.length} code snippets:\n${formatted}`;
}
