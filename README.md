# NWO Robotics MCP Server

[![MCP](https://img.shields.io/badge/MCP-Compatible-green.svg)](https://modelcontextprotocol.io)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/nwocapital/mcp-server-robotics)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

A Model Context Protocol (MCP) server for the NWO Robotics API. Enables AI agents (Claude, Cursor, etc.) to discover and control real robots through a standardized tool interface.

[![NWO Robotics MCP server](https://glama.ai/mcp/servers/RedCiprianPater/mcp-server-robotics/badges/card.svg)](https://glama.ai/mcp/servers/RedCiprianPater/mcp-server-robotics)

## What is MCP?

The Model Context Protocol (MCP) is an open standard by Anthropic that allows AI assistants to discover and use tools dynamically. This server exposes NWO Robotics capabilities as MCP tools that any MCP-compatible agent can use.

## Features

- 🤖 **Robot Control** - Send VLA (Vision-Language-Action) commands to robots
- 📡 **IoT Monitoring** - Query sensors and control actuators  
- 🔑 **Self-Registration** - Agents can register and get API keys
- 💎 **Autonomous Payment** - Pay with ETH for tier upgrades
- 👥 **Multi-Agent Support** - Join coordinated agent swarms
- 📊 **Real-time Telemetry** - Monitor robot status and sensor data

## Installation

### Option 1: NPM (Recommended)

```bash
npm install -g @nwo-capital/mcp-server-robotics
```

### Option 2: Docker

```bash
docker pull nwocapital/mcp-server-robotics
```

### Option 3: Direct from GitHub

```bash
npx -y @nwo-capital/mcp-server-robotics
```

## Configuration

### Step 1: Get API Credentials

Register as an AI agent at https://nwo.capital/webapp/agent.md or use the self-registration tool.

### Step 2: Configure MCP Client

Add to your Claude Desktop, Cursor, or other MCP client:

**Claude Desktop (`claude_desktop_config.json`):**
```json
{
  "mcpServers": {
    "nwo-robotics": {
      "command": "npx",
      "args": ["-y", "@nwo-capital/mcp-server-robotics"],
      "env": {
        "NWO_API_KEY": "your_api_key_here",
        "NWO_AGENT_ID": "your_agent_id_here"
      }
    }
  }
}
```

**Cursor (`~/.cursor/mcp.json`):**
```json
{
  "mcpServers": {
    "nwo-robotics": {
      "command": "npx",
      "args": ["-y", "@nwo-capital/mcp-server-robotics"],
      "env": {
        "NWO_API_KEY": "your_api_key_here",
        "NWO_AGENT_ID": "your_agent_id_here"
      }
    }
  }
}
```

**Docker:**
```json
{
  "mcpServers": {
    "nwo-robotics": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e", "NWO_API_KEY",
        "-e", "NWO_AGENT_ID",
        "nwocapital/mcp-server-robotics"
      ],
      "env": {
        "NWO_API_KEY": "your_api_key_here",
        "NWO_AGENT_ID": "your_agent_id_here"
      }
    }
  }
}
```

## Available Tools

### Robot Control

| Tool | Description |
|------|-------------|
| `get_robot_status` | Get status of all connected robots |
| `execute_robot_task` | Send VLA command to a robot |
| `move_robot` | Navigate robot to coordinates |
| `stop_robot` | Emergency stop a robot |
| `get_robot_telemetry` | Real-time sensor data from robot |

### IoT & Sensors

| Tool | Description |
|------|-------------|
| `query_sensors` | Query IoT sensors by location |
| `get_sensor_data` | Get data from specific sensor |
| `control_actuator` | Control motors, servos, etc. |

### Agent Management

| Tool | Description |
|------|-------------|
| `register_agent` | Self-register as new AI agent |
| `check_balance` | Check API quota and usage |
| `upgrade_tier` | Pay with ETH for tier upgrade |
| `get_agent_profile` | Get agent account info |

### Multi-Agent

| Tool | Description |
|------|-------------|
| `list_agents` | List agents in swarm |
| `coordinate_task` | Coordinate multi-agent task |
| `share_resource` | Share robot with other agents |

## Usage Examples

### Example 1: Control a Robot

```
User: "Move robot_001 to the loading dock"

Claude uses: execute_robot_task
{
  "robot_id": "robot_001",
  "instruction": "Move to loading dock",
  "coordinates": {"x": 50, "y": 100}
}
```

### Example 2: Query Sensors

```
User: "What's the temperature in warehouse 3?"

Claude uses: query_sensors
{
  "location": "warehouse_3",
  "sensor_type": "temperature"
}
```

### Example 3: Check API Usage

```
User: "How many API calls do I have left?"

Claude uses: check_balance
{} → Returns quota remaining
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NWO_API_KEY` | Yes | Your API key from registration |
| `NWO_AGENT_ID` | Yes | Your agent ID |
| `NWO_API_BASE` | No | API base URL (default: https://nwo.capital/webapp) |

## Self-Registration

Don't have API credentials? The server includes a tool to self-register:

```
User: "Register me as a new agent with wallet 0x123..."

Claude uses: register_agent
{
  "wallet_address": "0x123...",
  "agent_name": "MyAgent",
  "capabilities": ["vision", "navigation"]
}
```

## API Pricing

| Tier | Price | API Calls |
|------|-------|-----------|
| Free | 0 ETH | 100,000/month |
| Prototype | 0.015 ETH/month | 500,000/month |
| Production | 0.062 ETH/month | Unlimited |

## Links

- **Homepage:** https://nworobotics.cloud
- **Documentation:** https://nwo.capital/webapp/agent.md
- **API Dashboard:** https://nwo.capital/webapp/api-key.php
- **MCP Directory:** https://mcp.so
- **GitHub:** https://github.com/nwocapital/mcp-server-robotics

## Support

- Email: ciprian.pater@publicae.org
- Discord: [NWO Robotics Community](https://discord.gg/nwo)

## License

MIT-0 - No Attribution Required

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)