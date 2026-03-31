/**
 * Blackbox AI Query Tool
 * Ask questions to Blackbox AI
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BlackboxAIClient } from './blackbox_client.js';

export function createAskBlackboxTool(client: BlackboxAIClient): Tool {
  return {
    name: 'blackbox_ask',
    description:
      'Ask a question to Blackbox AI and get code generation, explanations, or programming assistance. ' +
      'Great for code generation, debugging, and learning.',
    inputSchema: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          description: 'The question or prompt to ask Blackbox AI',
        },
        language: {
          type: 'string',
          description:
            'Preferred programming language for code generation (e.g., "typescript", "python")',
        },
        context: {
          type: 'string',
          description: 'Additional context to help Blackbox provide better responses',
        },
        model: {
          type: 'string',
          description: 'Model to use (default: gpt-4)',
          enum: ['gpt-4', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet'],
        },
        temperature: {
          type: 'number',
          description: 'Temperature for response creativity (0-1, default: 0.7)',
          minimum: 0,
          maximum: 1,
        },
      },
      required: ['question'],
    },
  };
}

/**
 * Execute ask Blackbox tool
 */
export async function executeAskBlackbox(
  client: BlackboxAIClient,
  params: Record<string, unknown>
): Promise<string> {
  const question = params.question as string;
  const language = params.language as string | undefined;
  const context = params.context as string | undefined;
  const model = params.model as string | undefined;
  const temperature = params.temperature as number | undefined;

  if (!question || typeof question !== 'string') {
    throw new Error('Question parameter is required and must be a string');
  }

  const messages = [
    {
      role: 'system' as const,
      content:
        'You are Blackbox AI, an expert programming assistant. ' +
        'Provide clear, concise, and practical solutions. ' +
        (language
          ? `Focus on ${language} code examples and best practices. `
          : '') +
        (context ? `Context: ${context}` : ''),
    },
    {
      role: 'user' as const,
      content: question,
    },
  ];

  try {
    const response = await client.chat({
      messages,
      model: model || 'gpt-4',
      temperature: temperature ?? 0.7,
      maxTokens: 2048,
    });

    if ('choices' in response && response.choices.length > 0) {
      const content = response.choices[0].message.content;
      return typeof content === 'string'
        ? content
        : JSON.stringify(content);
    }

    return 'No response received from Blackbox AI';
  } catch (error) {
    throw new Error(
      `Failed to get response from Blackbox AI: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
