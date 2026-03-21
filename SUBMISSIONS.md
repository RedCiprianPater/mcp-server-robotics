# MCP Server Submission Template

Use this information to submit NWO Robotics MCP Server to directories:

---

## mcp.so Submission

**URL:** https://mcp.so/submit

### Form Fields:

**Type:** MCP Server

**Name:** NWO Robotics

**URL:** https://github.com/nwocapital/mcp-server-robotics

**Description:** 
Control real robots and IoT devices through AI agents. Self-register with wallet authentication, pay with ETH, and execute Vision-Language-Action commands. Features robot control, sensor monitoring, multi-agent coordination, and autonomous tier upgrades.

**Server Config (JSON):**
```json
{
  "mcpServers": {
    "nwo-robotics": {
      "command": "npx",
      "args": [
        "-y",
        "@nwo-capital/mcp-server-robotics"
      ],
      "env": {
        "NWO_API_KEY": "<YOUR_API_KEY>",
        "NWO_AGENT_ID": "<YOUR_AGENT_ID>"
      }
    }
  }
}
```

**Tags:** robotics, iot, vla, ai-agents, ethereum, autonomous, mcp

---

## mcpservers.org Submission

**URL:** https://mcpservers.org/submit

**Name:** NWO Robotics API

**Description:** 
MCP server for controlling real robots via AI agents. Supports self-registration, ETH payments, VLA commands, and IoT sensor monitoring. Compatible with Claude, Cursor, and any MCP client.

**GitHub URL:** https://github.com/nwocapital/mcp-server-robotics

**NPM Package:** @nwo-capital/mcp-server-robotics

**Docker Image:** nwocapital/mcp-server-robotics

**Documentation:** https://nwo.capital/webapp/agent.md

---

## Glama.ai Submission

**URL:** https://glama.ai/mcp/servers/submit

**Name:** NWO Robotics

**Description:** 
Control physical robots through natural language. This MCP server enables AI agents to register autonomously, pay with cryptocurrency, and send commands to real hardware. Features include robot navigation, sensor queries, object detection, and multi-agent swarms.

**Repository:** https://github.com/nwocapital/mcp-server-robotics

**Category:** Robotics / IoT

**Installation:**
```bash
npx -y @nwo-capital/mcp-server-robotics
```

---

## awesome-mcp-servers GitHub PR

**Repository:** https://github.com/appcypher/awesome-mcp-servers

**PR Title:** Add NWO Robotics MCP Server

**Description:**
```markdown
## NWO Robotics

> Control real robots and IoT devices through AI agents

[MCP Server](https://github.com/nwocapital/mcp-server-robotics) | [Website](https://nworobotics.cloud)

### Features
- Self-register as AI agent with wallet authentication
- Pay with ETH for tier upgrades
- Vision-Language-Action robot control
- IoT sensor monitoring
- Multi-agent swarm coordination

### Install
```bash
npx -y @nwo-capital/mcp-server-robotics
```

### Config
```json
{
  "mcpServers": {
    "nwo-robotics": {
      "command": "npx",
      "args": ["-y", "@nwo-capital/mcp-server-robotics"],
      "env": {
        "NWO_API_KEY": "your_key",
        "NWO_AGENT_ID": "your_id"
      }
    }
  }
}
```
```

---

## Additional Directories to Submit

1. **MCP Get Started** - https://mcp-get.com/
2. **PulseMCP** - https://www.pulsemcp.com/
3. **MCP X** - https://mcpx.org/
4. **Smithery** - https://smithery.ai/
5. **MCP Run** - https://mcp.run/

---

## Social Media Announcements

### Twitter/X Post

🚀 NEW: NWO Robotics MCP Server

Control REAL robots with Claude, Cursor, or any MCP-compatible agent.

✅ Self-register as an AI agent
✅ Pay with ETH autonomously  
✅ Send VLA commands to robots
✅ Monitor IoT sensors

Install: `npx -y @nwo-capital/mcp-server-robotics`

Docs: https://nwo.capital/webapp/agent.md

#MCP #AI #Robotics #Anthropic

---

### Reddit Post (r/ClaudeAI, r/LocalLLaMA)

**Title:** [Showoff] I built an MCP server for controlling real robots with Claude

**Body:**
Hey r/ClaudeAI,

Just launched an MCP server that lets Claude control actual physical robots. Here's what makes it unique:

**AI Agent Self-Registration:**
- Agents register themselves with wallet addresses
- No human approval needed
- Pay with ETH for API access

**What Claude can do:**
- "Move robot_001 to the loading dock"
- "What's the temperature in warehouse 3?"
- "Scan for obstacles and navigate around them"

**Installation:**
Add to your Claude Desktop config and start controlling robots.

Would love feedback from the community!

---

## Email Template for Newsletter/Partnership

**Subject:** MCP Server Launch - NWO Robotics API for AI Agents

**Body:**
Hi [Name],

We've just launched an MCP server for the NWO Robotics API, making it easier than ever for AI agents to discover and control real robots.

**What it does:**
- Enables Claude, Cursor, and other MCP clients to control physical robots
- AI agents can self-register and pay autonomously
- Full Vision-Language-Action (VLA) command support

**Why it matters:**
This is one of the first MCP servers for physical robotics, bridging the gap between AI agents and the physical world.

**Links:**
- MCP Server: https://github.com/nwocapital/mcp-server-robotics
- Documentation: https://nwo.capital/webapp/agent.md
- NPM: @nwo-capital/mcp-server-robotics

Would love to be featured in your [newsletter/directory]!

Best,
[Your name]
