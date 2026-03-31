/**
 * Blackbox AI Tools
 * Export all Blackbox AI integration tools
 */

export {
  BlackboxAIClient,
  initializeBlackboxClient,
} from './blackbox_client.js';

export * from './schemas/blackbox.js';

export { createQueryCodeTool, executeQueryCode } from './query_code.js';

export { createAskBlackboxTool, executeAskBlackbox } from './ask_blackbox.js';

export { registerQueryCodeTool } from './register_query_code.js';

export { registerAskBlackboxTool } from './register_ask_blackbox.js';

/**
 * Get all Blackbox AI tools
 */
export function getBlackboxTools() {
  return [
    'blackbox_query_code',
    'blackbox_ask',
  ];
}
