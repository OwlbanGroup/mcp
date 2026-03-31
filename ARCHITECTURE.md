# Blackbox AI MCP Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Your AI Agent                                 │
│              (Claude, Cline, N8N, etc.)                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ (MCP Protocol)
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                  Alby MCP Server (index.ts)                      │
│                                                                   │
│  ┌────────────────────┐  ┌──────────────────────────────────┐  │
│  │  Lightning Tools   │  │  Blackbox AI Tools               │  │
│  ├────────────────────┤  ├──────────────────────────────────┤  │
│  │ • get_info        │  │ • blackbox_query_code            │  │
│  │ • make_invoice    │  │ • blackbox_ask                   │  │
│  │ • pay_invoice     │  │                                  │  │
│  │ • get_balance     │  │                                  │  │
│  │ • lookup_invoice  │  │                                  │  │
│  │ • parse_invoice   │  │                                  │  │
│  │ • fiat_to_sats    │  │                                  │  │
│  └────────────────────┘  └──────────────────────────────────┘  │
│                                                                   │
└───┬──────────────────────────────────────────────────────────┬──┘
    │                                                          │
    │                                                          │
┌───▼──────────────────────┐               ┌─────────────────▼──┐
│ Alby & Lightning SDK      │               │ Blackbox AI Client │
│                           │               │ (blackbox_client)  │
│ • NWC Connection          │               │                    │
│ • Wallet Operations       │               │ • HTTP Client      │
│ • Invoice Management      │               │ • Auth (API Key)   │
│ • Lightning Tools         │               │ • Error Handling   │
└───────────────────────────┘               │ • Timeout Support  │
                                             │ • Response Parsing │
                                             └─────────┬──────────┘
                                                       │
                                                       │
┌──────────────────────────────────────────────────────▼──────┐
│            Blackbox AI API                                   │
│            (api.blackbox.ai)                                 │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ • Code Search Across Millions of Snippets            │ │
│  │ • AI Models (GPT-4, Claude, etc.)                    │ │
│  │ • Task Management                                     │ │
│  │ • Repository Integration                             │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Code Search Flow

```
User Query
    │
    ▼
AI Agent receives request
    │
    ├─► Calls: blackbox_query_code
    │                │
    │                ▼
    │         Query Validation
    │                │
    │                ▼
    │         Blackbox AI Client
    │         (blackbox_client.ts)
    │                │
    │                ├─► Add API Key
    │                ├─► Build Request
    │                ├─► Set Timeout
    │                │
    │                ▼
    │         Blackbox API
    │         /search/code
    │                │
    │                ▼
    │         Search Results
    │         (Code snippets)
    │                │
    │                ▼
    │         Format Results
    │         (query_code.ts)
    │                │
    │                ▼
    └─► Agent receives formatted code
         with URLs and metadata
```

### Code Generation Flow

```
User Prompt
    │
    ▼
AI Agent receives request
    │
    ├─► Calls: blackbox_ask
    │                │
    │                ▼
    │         Extract Parameters
    │         • question
    │         • language (optional)
    │         • model (optional)
    │         • temperature (optional)
    │                │
    │                ▼
    │         Build Message History
    │         (ask_blackbox.ts)
    │                │
    │                ▼
    │         Blackbox AI Client
    │         (blackbox_client.ts)
    │                │
    │                ├─► Add API Key
    │                ├─► Build Request
    │                ├─► Add Headers
    │                ├─► Set Model
    │                ├─► Set Temperature
    │                │
    │                ▼
    │         Blackbox API
    │         /messages
    │                │
    │                ▼
    │         AI Generation
    │                │
    │                ├─► GPT-4
    │                ├─► Claude
    │                └─► Other models
    │                │
    │                ▼
    │         Generated Response
    │         (Code + explanation)
    │                │
    │                ▼
    │         Format Response
    │         (ask_blackbox.ts)
    │                │
    │                ▼
    └─► Agent receives code
         with explanations
```

## File Structure & Dependencies

```
src/
├── mcp_server.ts
│   └── Creates MCP server
│       ├── Registers Lightning tools
│       └── Registers Blackbox tools
│           ├── registerQueryCodeTool()
│           └── registerAskBlackboxTool()
│
└── tools/
    ├── nwc/
    │   ├── Lightning wallet tools
    │   └── (existing)
    │
    └── blackbox/
        ├── index.ts
        │   └── Exports all modules
        │
        ├── blackbox_client.ts
        │   └── HTTP Client
        │       └── Makes API calls to Blackbox
        │
        ├── query_code.ts
        │   └── Code Search Tool
        │       └── Uses blackbox_client.ts
        │           └── searchCode() method
        │
        ├── ask_blackbox.ts
        │   └── Code Generation Tool
        │       └── Uses blackbox_client.ts
        │           └── chat() method
        │
        ├── register_query_code.ts
        │   └── MCP Registration
        │       └── Registers tool with server
        │
        ├── register_ask_blackbox.ts
        │   └── MCP Registration
        │       └── Registers tool with server
        │
        └── schemas/
            └── blackbox.ts
                └── TypeScript Type Definitions
                    ├── BlackboxChatRequest
                    ├── BlackboxCodeSearchRequest
                    ├── BlackboxTaskRequest
                    └── 10+ more types
```

## Configuration Flow

```
Environment Variables
    │
    ├─► BLACKBOX_API_KEY (required)
    │   │
    │   └─► Used in blackbox_client.ts
    │       └── new BlackboxAIClient({apiKey})
    │
    ├─► BLACKBOX_API_URL (optional)
    │   │
    │   └─► Default: https://api.blackbox.ai
    │       └── Used for API requests
    │
    └─► BLACKBOX_API_TIMEOUT (optional)
        │
        └─► Default: 30000ms
            └── Request timeout protection
```

## Component Interaction

```
┌──────────────────────────────────────────────────────────────┐
│  MCP Server (mcp_server.ts)                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ registerQueryCodeTool(server, client)                 │ │
│  │ registerAskBlackboxTool(server, client)               │ │
│  └────────────────────────────────────────────────────────┘ │
└───┬────────────────────────────────┬───────────────────────┘
    │                                │
    ▼                                ▼
┌──────────────────────┐    ┌──────────────────────┐
│  query_code.ts       │    │  ask_blackbox.ts     │
│                      │    │                      │
│ • executeQueryCode() │    │ • executeAskBlackbox()
│ • Input validation  │    │ • Input validation   │
│ • Format output     │    │ • Format output      │
└─────────┬────────────┘    └──────────┬───────────┘
          │                            │
          └────────────┬───────────────┘
                       │
                       ▼
            ┌──────────────────────────┐
            │ BlackboxAIClient          │
            │ (blackbox_client.ts)      │
            ├──────────────────────────┤
            │ • searchCode()            │
            │ • chat()                  │
            │ • createTask()            │
            │ • getTaskStatus()         │
            │ • streamTaskLogs()        │
            │ • cancelTask()            │
            │ • listGitHubRepos()       │
            │ • getAvailableModels()    │
            └─────────┬────────────────┘
                      │
                      ├─► Make HTTPS Request
                      ├─► Add Auth Header
                      ├─► Handle Timeout
                      └─► Parse Response
                              │
                              ▼
                      ┌──────────────────────┐
                      │ Blackbox AI API      │
                      │ api.blackbox.ai      │
                      └──────────────────────┘
```

## Error Handling Flow

```
API Request
    │
    ├─► Success (200)
    │   └─► Parse response
    │       └─► Return data
    │
    ├─► Client Error (4xx)
    │   ├─► 401: Invalid API key
    │   ├─► 429: Rate limited
    │   └─► 400: Bad request
    │       └─► Throw descriptive error
    │
    ├─► Server Error (5xx)
    │   └─► Retry with backoff
    │       └─► Throw if max retries exceeded
    │
    └─► Network Error
        ├─► Timeout (after 30s)
        ├─► Connection refused
        └─► No internet
            └─► Throw network error
```

## Type System

```
For each operation, we have types defined in schemas/blackbox.ts:

Code Search:
  Input:  BlackboxCodeSearchRequest
  Output: BlackboxCodeSearchResult[]

Chat/Generation:
  Input:  BlackboxChatRequest
  Output: BlackboxChatResponse

Tasks:
  Create: BlackboxTaskRequest
  Status: BlackboxTaskResponse

Auth:
  Config: BlackboxAuthConfig
```

## Security Model

```
┌──────────────────────────────────────────────┐
│ Environment (.env)                           │
│ BLACKBOX_API_KEY=sk_xxx                      │
└─────────────┬────────────────────────────────┘
              │
              ▼
        ┌─────────────────────┐
        │ initializeBlackbox() │
        └─────────┬───────────┘
                  │
                  ├─► Load API key from env
                  ├─► Validate key exists
                  └─► Create authenticated client
                      │
                      ▼
              ┌───────────────────┐
              │ BlackboxAIClient   │
              ├───────────────────┤
              │ • Stores API key   │
              │ • Uses HTTPS only  │
              │ • Timeout 30s      │
              │ • No key logging   │
              └─────────┬─────────┘
                        │
                        ├─► Add header:
                        │   Authorization: Bearer sk_xxx
                        │
                        └─► Send request over HTTPS
```

## Deployment Patterns

### Pattern 1: Claude Desktop
```
claude_desktop_config.json
    │
    ▼
MCP Server (stdio)
    │
    ├─► Load BLACKBOX_API_KEY
    │
    ├─► Initialize Blackbox Client
    │
    ├─► Register Tools
    │   ├─► blackbox_query_code
    │   └─► blackbox_ask
    │
    └─► Ready for Claude
        └─► Send/receive tool calls
```

### Pattern 2: N8N
```
N8N Agent Node
    │
    ▼
MCP Client Tool
    │
    ▼
MCP Server (HTTP Streamable or SSE)
    │
    ├─► Load BLACKBOX_API_KEY
    │
    ├─► Initialize Blackbox Client
    │
    ├─► Register Tools
    │   ├─► blackbox_query_code
    │   └─► blackbox_ask
    │
    └─► Ready for N8N workflow
        └─► Send/receive tool calls
```

### Pattern 3: Custom Agent
```
Your App
    │
    ▼
Spawn MCP Server Process
    │
    ├─► Pass env vars (BLACKBOX_API_KEY)
    │
    └─► Connect via stdio/HTTP
        │
        ├─► Initialize Blackbox
        │
        ├─► Register Tools
        │
        └─► Accept tool calls
            └─► Return results
```

## Performance Characteristics

```
Operation           Typical Time    Max Timeout    Notes
─────────────────────────────────────────────────────
Code Search         100-500ms       30s            Indexed, fast
Generate Code       2-5s            30s            AI generation
Task Creation       1-2s            30s            Queue job
Task Status         100-200ms       30s            Quick check
Stream Logs         Real-time       30s            Per chunk
List Repos          500ms           30s            GitHub API
```

## Monitoring & Debugging

```
Environment Variable: BLACKBOX_API_KEY
    │
    ├─► Set = Tools enabled
    │
    └─► Not set = Warning logged, tools disabled

Debug Flow:
    User → Agent → MCP Server → Blackbox Client → API
                                      │
                                      └─► Check auth
                                      └─► Log request
                                      └─► Track timeout
                                      └─► Parse response
```

---

This architecture ensures:
- ✅ Clean separation of concerns
- ✅ Type safety throughout
- ✅ Proper error handling
- ✅ Security best practices
- ✅ Easy debugging
- ✅ Scalable design
