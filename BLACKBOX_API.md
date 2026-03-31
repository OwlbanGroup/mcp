# Blackbox AI Client API Documentation

Complete API reference for the Blackbox AI client integrated into the MCP server.

## Table of Contents

1. [Installation](#installation)
2. [Client Initialization](#client-initialization)
3. [API Methods](#api-methods)
4. [Type Definitions](#type-definitions)
5. [Error Handling](#error-handling)
6. [Examples](#examples)

## Installation

The Blackbox AI client is included in the MCP server. No additional installation needed.

```bash
npm install  # Installs all dependencies including Blackbox AI
```

## Client Initialization

### From Environment Variables

```typescript
import { initializeBlackboxClient } from './tools/blackbox/index.js';

// Automatically reads BLACKBOX_API_KEY from .env
const client = initializeBlackboxClient();
```

### With Custom Configuration

```typescript
import { BlackboxAIClient } from './tools/blackbox/blackbox_client.js';

const client = new BlackboxAIClient({
  apiKey: 'your_api_key_here',
  baseUrl: 'https://api.blackbox.ai', // optional
  timeout: 30000, // optional, in milliseconds
});
```

## API Methods

### searchCode(request)

Search for code snippets across Blackbox's indexed repositories.

**Parameters:**
```typescript
interface BlackboxCodeSearchRequest {
  query: string;           // Required: search query
  language?: string;       // Optional: programming language filter
  repository?: string;     // Optional: specific repository
  limit?: number;          // Optional: max results (1-50, default: 10)
}
```

**Returns:**
```typescript
Promise<BlackboxCodeSearchResult[]>
```

**Result Structure:**
```typescript
interface BlackboxCodeSearchResult {
  id: string;              // Unique result ID
  repository: string;      // Repository name
  file: string;           // File path
  language: string;       // Programming language
  snippet: string;        // Code snippet
  lineNumber: number;     // Line number in file
  url: string;            // URL to source
}
```

**Example:**
```typescript
const results = await client.searchCode({
  query: 'async error handling',
  language: 'typescript',
  limit: 5,
});

results.forEach(result => {
  console.log(`${result.repository}/${result.file}`);
  console.log(result.snippet);
  console.log(`Line: ${result.lineNumber}`);
});
```

---

### chat(request)

Send a message to Blackbox AI for code generation, explanations, or assistance.

**Parameters:**
```typescript
interface BlackboxChatRequest {
  messages: BlackboxMessage[];     // Conversation messages
  model?: string;                  // Model to use
  temperature?: number;            // Creativity level (0-1)
  maxTokens?: number;              // Max response tokens
  stream?: boolean;                // Enable streaming
}

interface BlackboxMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
```

**Returns:**
```typescript
Promise<BlackboxChatResponse> | Promise<AsyncIterable<string>>
```

**Response Structure (Non-Streaming):**
```typescript
interface BlackboxChatResponse {
  id: string;
  choices: Array<{
    message: BlackboxMessage;
    finishReason: string;
  }>;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
```

**Example (Non-Streaming):**
```typescript
const response = await client.chat({
  messages: [
    {
      role: 'system',
      content: 'You are a TypeScript expert.',
    },
    {
      role: 'user',
      content: 'How do I implement a retry mechanism?',
    },
  ],
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2048,
});

console.log(response.choices[0].message.content);
```

**Example (Streaming):**
```typescript
const stream = await client.chat({
  messages: [
    {
      role: 'user',
      content: 'Write a quick sort algorithm',
    },
  ],
  stream: true,
});

for await (const chunk of stream as AsyncIterable<string>) {
  process.stdout.write(chunk);
}
```

---

### createTask(request)

Create a long-running task for Blackbox to execute.

**Parameters:**
```typescript
interface BlackboxTaskRequest {
  prompt: string;           // Task description
  repository: string;       // Target repository
  branch?: string;         // Target branch (default: main)
  instructions?: string;   // Additional instructions
}
```

**Returns:**
```typescript
Promise<BlackboxTaskResponse>
```

**Response Structure:**
```typescript
interface BlackboxTaskResponse {
  taskId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  result?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Example:**
```typescript
const task = await client.createTask({
  prompt: 'Add error handling to all API endpoints',
  repository: 'my-project',
  branch: 'main',
  instructions: 'Use try-catch blocks and return proper error responses',
});

console.log(`Task created: ${task.taskId}`);
console.log(`Status: ${task.status}`);
```

---

### getTaskStatus(taskId)

Get the current status of a task.

**Parameters:**
- `taskId` (string): Task ID from createTask

**Returns:**
```typescript
Promise<BlackboxTaskResponse>
```

**Example:**
```typescript
const status = await client.getTaskStatus('task-123');
console.log(status.status); // 'running', 'completed', etc.
```

---

### streamTaskLogs(taskId)

Stream logs from a running task in real-time.

**Parameters:**
- `taskId` (string): Task ID from createTask

**Returns:**
```typescript
Promise<AsyncIterable<string>>
```

**Example:**
```typescript
const logs = await client.streamTaskLogs('task-123');

for await (const logChunk of logs) {
  console.log(logChunk);
}
```

---

### cancelTask(taskId)

Cancel a running or queued task.

**Parameters:**
- `taskId` (string): Task ID to cancel

**Returns:**
```typescript
Promise<void>
```

**Example:**
```typescript
await client.cancelTask('task-123');
console.log('Task cancelled');
```

---

### listGitHubRepos()

List GitHub repositories connected to Blackbox.

**Returns:**
```typescript
Promise<BlackboxGitHubRepo[]>
```

**Repository Structure:**
```typescript
interface BlackboxGitHubRepo {
  id: number;
  name: string;
  fullName: string;
  url: string;
  description: string;
  isPrivate: boolean;
}
```

**Example:**
```typescript
const repos = await client.listGitHubRepos();

repos.forEach(repo => {
  console.log(`${repo.fullName}: ${repo.description}`);
});
```

---

### getAvailableModels()

Get list of available AI models.

**Returns:**
```typescript
Promise<string[]>
```

**Example:**
```typescript
const models = await client.getAvailableModels();
console.log('Available models:', models);
// Output: ['gpt-4', 'gpt-3.5-turbo', 'claude-3-opus', ...]
```

## Type Definitions

Complete TypeScript interfaces for type safety.

```typescript
// Search request/response
interface BlackboxCodeSearchRequest {
  query: string;
  language?: string;
  repository?: string;
  limit?: number;
}

interface BlackboxCodeSearchResult {
  id: string;
  repository: string;
  file: string;
  language: string;
  snippet: string;
  lineNumber: number;
  url: string;
}

// Chat request/response
interface BlackboxChatRequest {
  messages: BlackboxMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

interface BlackboxMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface BlackboxChatResponse {
  id: string;
  choices: Array<{
    message: BlackboxMessage;
    finishReason: string;
  }>;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Task request/response
interface BlackboxTaskRequest {
  prompt: string;
  repository: string;
  branch?: string;
  instructions?: string;
}

interface BlackboxTaskResponse {
  taskId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  result?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

// GitHub repositories
interface BlackboxGitHubRepo {
  id: number;
  name: string;
  fullName: string;
  url: string;
  description: string;
  isPrivate: boolean;
}

// Client configuration
interface BlackboxAuthConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}
```

## Error Handling

### Common Errors

**Missing API Key:**
```typescript
try {
  const client = initializeBlackboxClient();
} catch (error) {
  console.error(error.message);
  // "BLACKBOX_API_KEY environment variable is not set"
}
```

**API Errors:**
```typescript
try {
  const results = await client.searchCode({ query: 'test' });
} catch (error) {
  if (error.message.includes('401')) {
    console.error('Invalid API key');
  } else if (error.message.includes('429')) {
    console.error('Rate limited');
  } else if (error.includes('timeout')) {
    console.error('Request timeout');
  }
}
```

**Network Errors:**
```typescript
try {
  const results = await client.searchCode({ query: 'test' });
} catch (error) {
  console.error('Network error:', error.message);
  // Implement retry logic
}
```

### Retry Strategy

```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const exponentialDelay = delayMs * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, exponentialDelay));
    }
  }
  throw new Error('Max retries exceeded');
}

// Usage
const results = await retryWithBackoff(() =>
  client.searchCode({ query: 'async pattern' })
);
```

## Examples

### Complete Code Search Workflow

```typescript
import { initializeBlackboxClient } from './tools/blackbox/index.js';

async function findAndAnalyzeCode() {
  const client = initializeBlackboxClient();

  // Search for error handling patterns
  const results = await client.searchCode({
    query: 'error handling middleware',
    language: 'typescript',
    limit: 5,
  });

  console.log(`Found ${results.length} examples:`);
  
  results.forEach(result => {
    console.log(`\n${result.repository}/${result.file}`);
    console.log(`Lines: ${result.lineNumber}`);
    console.log('---');
    console.log(result.snippet);
  });

  // Generate improvement based on patterns found
  const response = await client.chat({
    messages: [
      {
        role: 'system',
        content: 'You are a TypeScript expert focused on error handling.',
      },
      {
        role: 'user',
        content: `Improve this error handling pattern for production use:
        
        ${results[0]?.snippet || 'No examples found'}`,
      },
    ],
    model: 'gpt-4',
    temperature: 0.5,
  });

  if ('choices' in response) {
    console.log('\nImprovement suggestion:');
    console.log(response.choices[0].message.content);
  }
}

findAndAnalyzeCode().catch(console.error);
```

### Multi-Model Comparison

```typescript
async function compareModels(question: string) {
  const client = initializeBlackboxClient();
  const models = ['gpt-4', 'gpt-3.5-turbo', 'claude-3-sonnet'];

  for (const model of models) {
    const response = await client.chat({
      messages: [{ role: 'user', content: question }],
      model,
      maxTokens: 500,
    });

    if ('choices' in response) {
      console.log(`\n=== ${model} ===`);
      console.log(response.choices[0].message.content);
    }
  }
}
```

### Streaming Large Generations

```typescript
async function generateLargeCode() {
  const client = initializeBlackboxClient();

  const stream = await client.chat({
    messages: [
      {
        role: 'user',
        content: 'Generate a complete REST API with TypeScript and Express',
      },
    ],
    stream: true,
    model: 'gpt-4',
  });

  if (stream instanceof ReadableStream) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      process.stdout.write(decoder.decode(value, { stream: true }));
    }
  }
}
```

## Environment Variables

```bash
# Required
BLACKBOX_API_KEY=sk_xxx...

# Optional
BLACKBOX_API_URL=https://api.blackbox.ai
BLACKBOX_API_TIMEOUT=30000
```

## Performance Optimization

### Caching Results

```typescript
const cache = new Map<string, BlackboxCodeSearchResult[]>();

async function cachedSearch(query: string) {
  if (cache.has(query)) {
    return cache.get(query)!;
  }

  const results = await client.searchCode({ query });
  cache.set(query, results);
  return results;
}
```

### Batch Processing

```typescript
async function batchSearch(queries: string[]) {
  return Promise.all(
    queries.map(query =>
      client.searchCode({ query, limit: 5 })
    )
  );
}
```

## Security Considerations

1. **Keep API Key Safe**
   - Never commit `.env` files
   - Use environment variables
   - Rotate keys periodically

2. **Rate Limiting**
   - Implement request throttling
   - Cache frequently used queries
   - Use batch operations

3. **Input Validation**
   - Validate user queries
   - Sanitize code snippets
   - Limit search scope

## Support & Resources

- [Blackbox AI Documentation](https://docs.blackbox.ai)
- [API Reference](https://docs.blackbox.ai/api-reference)
- [GitHub Issues](https://github.com/getAlby/mcp/issues)
- [Blackbox Community](https://blackbox.ai/community)
