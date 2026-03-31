# Blackbox AI MCP - Usage Examples & Best Practices

This guide provides practical examples and best practices for using Blackbox AI tools with your MCP server.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Code Search Examples](#code-search-examples)
3. [Code Generation Examples](#code-generation-examples)
4. [Best Practices](#best-practices)
5. [Advanced Usage](#advanced-usage)
6. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

1. MCP server built and configured
2. Blackbox AI API key set in `.env`
3. A compatible AI agent (Claude, OpenRouter, etc.)

### Verify Setup

```bash
# Test the MCP server in inspect mode
npm run inspect

# You should see:
# - blackbox_query_code
# - blackbox_ask
```

## Code Search Examples

The `blackbox_query_code` tool searches across millions of code snippets. Here are practical examples:

### Example 1: Find Error Handling Patterns

```text
Query: "try catch error handling"
Language: typescript
Limit: 5
```

**Expected Results:**

- Real-world error handling implementations
- Production-ready patterns
- Different approaches to error handling

### Example 2: Search for Specific API Usage

```text
Query: "fetch with timeout"
Language: javascript
Limit: 10
```

**Expected Results:**

- How to implement fetch timeouts
- Common patterns and implementations
- Best practices

### Example 3: Find Database Query Examples

```text
Query: "async database query"
Language: python
Repository: django
Limit: 5
```

**Expected Results:**

- Django ORM query examples
- Async database operations
- Performance optimization patterns

### Example 4: Security Pattern Search

```text
Query: "input validation sanitization"
Language: typescript
Limit: 15
```

**Expected Results:**

- Input validation implementations
- Security best practices
- Common vulnerabilities and fixes

## Code Generation Examples

The `blackbox_ask` tool generates code based on natural language prompts.

### Example 1: Generate a Retry Function

```json
{
  "question": "Write a TypeScript function that retries a failed promise up to 3 times with exponential backoff",
  "language": "typescript",
  "temperature": 0.5,
  "model": "gpt-4"
}
```

**Expected Response:**

```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
```

### Example 2: Generate API Endpoint Handler

```json
{
  "question": "Create an Express middleware that validates JWT tokens and extracts user info",
  "language": "typescript",
  "context": "Using jsonwebtoken library, middleware pattern",
  "temperature": 0.7,
  "model": "claude-3-sonnet"
}
```

### Example 3: Generate Database Migration

```json
{
  "question": "Write a Prisma migration to add a users table with email, password (hashed), and timestamps",
  "language": "typescript",
  "context": "Using Prisma ORM, bcrypt for password hashing",
  "model": "gpt-4"
}
```

### Example 4: Generate Test Cases

```json
{
  "question": "Write Jest test cases for a function that calculates shipping costs based on weight and distance",
  "language": "typescript",
  "context": "Include edge cases and error scenarios",
  "temperature": 0.5
}
```

## Best Practices

### 1. Ask Specific Questions

**Good:**

```text
"Create a React hook that handles pagination with type safety"
```

**Bad:**

```text
"Help me with React"
```

### 2. Provide Context

**Good:**

```json
{
  "question": "How do I handle concurrent requests?",
  "language": "typescript",
  "context": "Node.js server with 100+ concurrent users, using Express"
}
```

**Bad:**

```json
{
  "question": "How do I handle concurrent requests?"
}
```

### 3. Use Appropriate Models

- **GPT-4**: Complex code, architecture decisions
- **Claude-3-Sonnet**: Balanced speed and quality
- **GPT-3.5-Turbo**: Quick generations, less complex code

```json
{
  "question": "Design a complete auth system with JWT and refresh tokens",
  "model": "gpt-4",
  "temperature": 0.5
}
```

### 4. Control Response Creativity

- **Temperature 0.2-0.4**: Deterministic, factual code generation
- **Temperature 0.5-0.7**: Balanced, good for production code
- **Temperature 0.8-1.0**: Creative, exploratory solutions

```json
{
  "question": "Generate a creative error message system",
  "temperature": 0.8
}
```

### 5. Search with Filters

Use language and repository filters to narrow results:

```text
Query: "authentication middleware"
Language: typescript
Limit: 5
Repository: express.js
```

## Advanced Usage

### Combining Search and Generation

1. **Search first** to understand patterns:

```text
Query: "implement WebSocket connection"
Language: typescript
Limit: 10
```

2. **Then generate** improved version:

```json
{
  "question": "Based on common WebSocket patterns, create a production-ready WebSocket handler with reconnection logic",
  "language": "typescript",
  "context": "Node.js backend, handle 1000+ connections",
  "model": "gpt-4"
}
```

### Building Learning Workflows

```text
User Request: "I want to learn how to implement caching"

Step 1: Search for patterns
→ blackbox_query_code: "cache implementation"

Step 2: Analyze results
→ User reviews common patterns

Step 3: Generate custom solution
→ blackbox_ask: "Create a Redis caching layer for my Node.js API with TTL management"

Step 4: Compare with found patterns
→ Learn best practices and improvements
```

### Performance Optimization

For large language models and complex generation:

```json
{
  "question": "Optimize this database query for 1M+ records",
  "model": "gpt-4",
  "temperature": 0.3,
  "context": "PostgreSQL, need < 100ms response time"
}
```

## Practical Workflow Examples

### Scenario: Building a New Feature

1. Search for reference implementations

```text
Search: "user authentication with role-based access"
```

2. Generate boilerplate

```text
Ask: "Create a TypeScript auth service with role checking"
```

3. Search for testing patterns

```text
Search: "unit tests authentication"
```

4. Generate tests

```text
Ask: "Write comprehensive tests for the auth service"
```

### Scenario: Debugging Production Issue

1. Search for known patterns and solutions

```text
Search: "memory leak detection Node.js"
```

2. Ask for diagnostic help

```text
Ask: "How to identify memory leaks in Express.js applications?"
```

3. Search for common fixes

```text
Search: "event emitter cleanup"
```

4. Generate fix

```text
Ask: "Create proper cleanup logic for event listeners"
```

### Scenario: Performance Improvement

1. Search for optimizations

```text
Search: "optimize database queries N+1 problem"
```

2. Ask for implementation

```text
Ask: "Fix N+1 queries using DataLoader pattern"
```

3. Search for caching

```text
Search: "cache implementation Redis"
```

4. Implement complete solution

```text
Ask: "Implement Redis caching with automatic invalidation"
```

## Troubleshooting

### Query Returns No Results

**Problem:** `"No code snippets found for query: ..."`

**Solutions:**

1. Try simpler keywords
2. Remove language filters
3. Use broader search terms
4. Search for similar concepts

```text
Try: "error handling" instead of "custom error handler with retry logic"
```

### Generated Code Has Syntax Errors

**Problem:** Generated code doesn't compile

**Solutions:**

1. Specify exact language version
2. Add more context about dependencies
3. Use more explicit questions

```text
Good: "Generate TypeScript (4.9+) code for async iteration with proper typing"
Bad: "Give me iteration code"
```

### Response Seems Generic or Low Quality

**Problem:** Result doesn't match your needs

**Solutions:**

1. Lower temperature (0.3-0.5) for more focused responses
2. Add specific context
3. Try different model
4. Search for similar code first as reference

```json
{
  "question": "Create a production-grade implementation of...",
  "temperature": 0.3,
  "model": "gpt-4",
  "context": "Must handle 10k+ concurrent connections, 99.99% uptime"
}
```

### API Rate Limiting

**Problem:** "Too many requests" or "Rate limit exceeded"

**Solutions:**

1. Implement request queuing in your agent
2. Add delays between requests
3. Cache results when possible
4. Batch similar queries

## Integration Examples

### With Claude Desktop

```json
{
  "mcpServers": {
    "alby-with-blackbox": {
      "command": "npx",
      "args": ["-y", "@getalby/mcp"],
      "env": {
        "NWC_CONNECTION_STRING": "your_nwc_string",
        "BLACKBOX_API_KEY": "your_api_key"
      }
    }
  }
}
```

### With N8N

1. Add MCP Client tool
2. Configure STDIO with command: `npx -y @getalby/mcp`
3. Set environment: `BLACKBOX_API_KEY=your_key`
4. Use in AI agent nodes

### Custom Agent Integration

```typescript
// In your agent, use the tools
const response = await agent.call({
  tools: ['blackbox_query_code', 'blackbox_ask'],
  prompt: 'Find and improve error handling patterns'
});
```

## Performance Tips

1. **Limit search results** to what you need (5-10 usually sufficient)
2. **Use specific queries** to reduce parsing overhead
3. **Cache frequently used searches** in your agent
4. **Batch similar queries** together
5. **Use appropriate models** (gpt-3.5-turbo for simple code)

## Resources

- [Blackbox AI Documentation](https://docs.blackbox.ai)
- [API Reference](https://docs.blackbox.ai/api-reference/introduction)
- [Model capabilities](https://blackbox.ai/models)
- [Community examples](https://github.com/getAlby/awesome-ai-bitcoin)

## Support

- Check [BLACKBOX_INTEGRATION.md](./BLACKBOX_INTEGRATION.md) for setup help
- Report issues on [GitHub](https://github.com/getAlby/mcp/issues)
- Ask Blackbox AI questions directly at [blackbox.ai](https://blackbox.ai)
