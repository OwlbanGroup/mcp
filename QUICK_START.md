# Blackbox AI MCP - Quick Reference Card

## 🚀 Quick Start (2 minutes)

```bash
# 1️⃣  Get API Key
# Visit: https://blackbox.ai → Settings → API Keys → Create

# 2️⃣  Windows
.\setup-blackbox.bat

# 3️⃣  Unix/Mac
chmod +x setup-blackbox.sh
./setup-blackbox.sh

# 4️⃣  Manual (any OS)
npm install && npm run build

# 5️⃣  Start
npm start
# or
npm run start:http  # for HTTP mode
```

## 📝 Environment Configuration

```env
# Required
BLACKBOX_API_KEY=sk_xxx...

# Optional
BLACKBOX_API_URL=https://api.blackbox.ai
BLACKBOX_API_TIMEOUT=30000
```

## 🛠️ Available Tools

### 1. Code Search: `blackbox_query_code`

```json
{
  "query": "async error handling",
  "language": "typescript",
  "repository": "optional-repo",
  "limit": 5
}
```

**Languages Supported**: typescript, javascript, python, java, go, rust, csharp, php, ruby, cpp, c

### 2. Code Generation: `blackbox_ask`

```json
{
  "question": "How do I implement retry logic?",
  "language": "typescript",
  "context": "Optional context",
  "model": "gpt-4",
  "temperature": 0.7
}
```

**Models**: gpt-4, gpt-3.5-turbo, claude-3-opus, claude-3-sonnet

## 📚 Documentation

| Link | Content |
|------|---------|
| [BLACKBOX_INTEGRATION.md](./BLACKBOX_INTEGRATION.md) | Complete setup & configuration |
| [BLACKBOX_EXAMPLES.md](./BLACKBOX_EXAMPLES.md) | Real-world examples & best practices |
| [BLACKBOX_API.md](./BLACKBOX_API.md) | Detailed API reference |
| [INSTALLATION_SUMMARY.md](./INSTALLATION_SUMMARY.md) | What was installed |

## 🧪 Test It

```bash
# Inspect the tools
npm run inspect

# Should show:
# ✓ blackbox_query_code
# ✓ blackbox_ask
```

## 💡 Quick Examples

### Find Error Handling Code
```text
Search: "try catch error handling"
Language: typescript
Limit: 5
```

### Generate a Retry Function
```text
Question: "Create a retry function with exponential backoff in TypeScript"
Model: gpt-4
Temperature: 0.5
```

### Learn from Examples
```text
1. Search: "authentication middleware"
2. Ask: "Improve this pattern for production" 
3. Apply: Use generated code in your project
```

## 🔑 Environment File

Create `.env` with:
```env
NWC_CONNECTION_STRING="nostr+walletconnect://..."
BLACKBOX_API_KEY=your_key_here
```

## ⚡ Common Issues

| Issue | Solution |
|-------|----------|
| "API key not set" | Add `BLACKBOX_API_KEY` to `.env` |
| "Invalid API key" | Verify key at https://blackbox.ai |
| "No results found" | Try broader search terms |
| "Build fails" | Run `npm install` first |
| "Tools not showing" | Restart server, check build/ exists |

## 🎯 Use Cases

- 🔍 **Learn**: Find real-world code examples
- 🛠️ **Build**: Generate functions and classes
- 🐛 **Debug**: Search for solutions and patterns
- 📚 **Reference**: Browse production code implementations
- 🚀 **Scale**: Get help with complex problems

## 📱 Integration Guides

### Claude Desktop
See: [BLACKBOX_INTEGRATION.md#add-your-blackbox-connection](BLACKBOX_INTEGRATION.md)

### N8N
See: [BLACKBOX_INTEGRATION.md#usage-with-n8n](BLACKBOX_INTEGRATION.md)

### Cline, Windsurf, etc.
See: [README.md](./README.md)

## 🔗 Resources

- 📖 [Blackbox Docs](https://docs.blackbox.ai)
- 🔌 [API Reference](https://docs.blackbox.ai/api-reference)
- 💬 [Community](https://blackbox.ai/community)
- 🐛 [Report Issues](https://github.com/getAlby/mcp/issues)

## 🆘 Need Help?

1. Check [BLACKBOX_INTEGRATION.md](./BLACKBOX_INTEGRATION.md#troubleshooting)
2. Review [BLACKBOX_EXAMPLES.md](./BLACKBOX_EXAMPLES.md) for patterns
3. Read [BLACKBOX_API.md](./BLACKBOX_API.md) for API details
4. Visit https://blackbox.ai/support

## 💻 Supported Systems

- ✅ Windows (use `setup-blackbox.bat`)
- ✅ macOS (use `setup-blackbox.sh`)
- ✅ Linux (use `setup-blackbox.sh`)

## 🎓 Learning Path

1. **Setup**: Run `setup-blackbox.bat` or `setup-blackbox.sh`
2. **Test**: Run `npm run inspect`
3. **Learn**: Read [BLACKBOX_EXAMPLES.md](./BLACKBOX_EXAMPLES.md)
4. **Explore**: Try different searches and prompts
5. **Build**: Integrate with your AI agent

## ✅ Checklist

- [ ] Got Blackbox API key from https://blackbox.ai
- [ ] Added key to `.env` file
- [ ] Ran setup script or `npm install && npm run build`
- [ ] Ran `npm run inspect` - saw both tools
- [ ] Started server with `npm start`
- [ ] Tested with `blackbox_query_code` or `blackbox_ask`
- [ ] Connected to AI agent (Claude, N8N, etc.)
- [ ] Reading documentation for best practices

## 🎉 You're Ready!

```bash
# Start using Blackbox AI
npm start
# or
npm run start:http
```

**Happy coding with Blackbox AI! 🚀**

---

**Version**: 1.1.1  
**Last Updated**: March 31, 2026  
**Status**: ✅ Production Ready
