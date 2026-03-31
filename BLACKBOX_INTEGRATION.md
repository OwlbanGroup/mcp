# Blackbox AI Integration Guide

This MCP server now includes comprehensive Blackbox AI integration, enabling AI-powered code search, generation, and assistance capabilities.

## Getting Started

### 1. Obtain Blackbox API Key

1. Visit [Blackbox AI](https://blackbox.ai)
2. Sign up or log in with your GitHub/Google account
3. Navigate to your account settings
4. Create a new API key
5. Copy your API key

### 2. Configure Environment Variables

Create a `.env` file in the project root (or copy from `.env.example`):

```bash
cp .env.example .env
```

Add your Blackbox AI API key:

```bash
BLACKBOX_API_KEY=your_api_key_here
```

### 3. Build and Run

```bash
# Build the project
yarn build

# Start the MCP server
yarn start

# Or for HTTP mode
yarn start:http
```

## Available Tools

### 1. Query Code (`blackbox_query_code`)

Search for code snippets across Blackbox's indexed repositories.

**Parameters:**

- `query` (required): The code search query (e.g., "async function", "error handling")
- `language` (optional): Programming language filter (typescript, python, javascript, java, go, rust, csharp, php, ruby, cpp, c)
- `repository` (optional): Specific repository to search within
- `limit` (optional): Maximum results (1-50, default: 10)

**Example:**

```json
{
  "query": "async error handling",
  "language": "typescript",
  "limit": 5
}
```

**Response:**

Returns formatted code snippets with file location, line number, and URL to source.

### 2. Ask Blackbox (`blackbox_ask`)

Ask questions to Blackbox AI for code generation, explanations, or programming assistance.

**Parameters:**

- `question` (required): The question or prompt
- `language` (optional): Preferred programming language (e.g., "typescript")
- `context` (optional): Additional context for better responses
- `model` (optional): Model to use (gpt-4, gpt-3.5-turbo, claude-3-opus, claude-3-sonnet)
- `temperature` (optional): Response creativity (0-1, default: 0.7)

**Example:**

```json
{
  "question": "How do I implement a retry mechanism?",
  "language": "typescript",
  "context": "For HTTP requests in Node.js",
  "model": "gpt-4"
}
```

**Response:**

Returns a detailed AI-generated response with code examples and explanations.

## Architecture

```text
src/tools/blackbox/
├── blackbox_client.ts          # HTTP client for Blackbox API
├── ask_blackbox.ts             # Ask tool implementation
├── query_code.ts               # Code query tool implementation
├── register_ask_blackbox.ts    # MCP tool registration
├── register_query_code.ts      # MCP tool registration
├── schemas/
│   └── blackbox.ts             # TypeScript type definitions
└── index.ts                    # Exports all Blackbox components
```

## Features

✅ **Code Search**: Search millions of code snippets across indexed repositories
✅ **Code Generation**: AI-powered code generation based on natural language prompts
✅ **Multi-Language Support**: Works with 10+ programming languages
✅ **Error Handling**: Graceful error handling with informative messages
✅ **API Key Management**: Secure configuration via environment variables
✅ **Request Timeout**: Configurable timeout protection
✅ **Model Selection**: Choose between multiple AI models
✅ **Temperature Control**: Fine-tune response creativity
✅ **Context-Aware**: Support for providing additional context to AI

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `BLACKBOX_API_KEY` | Yes | - | Your Blackbox AI API key |
| `BLACKBOX_API_URL` | No | `https://api.blackbox.ai` | Blackbox API base URL |
| `BLACKBOX_API_TIMEOUT` | No | `30000` | Request timeout in milliseconds |

### Advanced Configuration

For enterprise deployments with different API endpoints:

```bash
BLACKBOX_API_URL=https://enterprise.blackbox.ai
BLACKBOX_API_TIMEOUT=60000
```

## Error Handling

The integration includes robust error handling:

- **Missing API Key**: Clear error message if `BLACKBOX_API_KEY` is not set
- **Network Errors**: Handled gracefully with informative error messages
- **Timeout Protection**: Requests timeout after configurable duration
- **API Errors**: Detailed error responses from Blackbox API

## Usage Examples

### In Your Agent

When using this MCP server with your AI agent, you can now:

#### Query Code

```text
User: "Show me examples of TypeScript async error handling"
Agent: [Uses blackbox_query_code tool]
Result: Find best practices and real-world examples
```

#### Generate Code

```text
User: "Generate a function to parse JSON with error handling"
Agent: [Uses blackbox_ask tool]
Result: Get production-ready code with explanations
```

## Performance Optimization

- **Caching**: Results are cached at the agent level for repeated queries
- **Streaming**: Large responses can be streamed for better UX
- **Indexed Repositories**: Blackbox's indexed code enables instant results
- **Model Selection**: Choose faster models for quick responses, more powerful ones for complex tasks

## Security Considerations

1. **API Key Protection**: Keep your API key in `.env` and never commit it
2. **Rate Limiting**: Blackbox API includes built-in rate limiting
3. **HTTPS Only**: All requests use encrypted HTTPS connections
4. **No Code Storage**: Search results are not stored on your system

## Troubleshooting

### "BLACKBOX_API_KEY environment variable is not set"

**Solution**: Add your API key to `.env` file as shown in setup steps

### "Blackbox API error (401)"

**Solution**: Verify your API key is valid and active

### "Blackbox API request timeout"

**Solution**: Increase `BLACKBOX_API_TIMEOUT` environment variable

### Tool not appearing in MCP server

**Solution**: Check that Blackbox API key is configured (see error logs)

## API Reference

For complete Blackbox AI API documentation, visit [Blackbox API Reference](https://docs.blackbox.ai/api-reference/introduction)

## Support

- 🐛 Report bugs: [GitHub Issues](https://github.com/getAlby/mcp/issues)
- 📚 Documentation: [Blackbox AI Docs](https://docs.blackbox.ai)
- 💬 Community: [Blackbox AI Community](https://blackbox.ai/community)

## License

MIT - See LICENSE file for details
