# NWO Robotics MCP Server v2.0

Complete Model Context Protocol (MCP) server for the NWO Robotics API with 77 integrated tools covering SLAM, reinforcement learning, advanced sensors, and full robotic system control.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg)](.)

## 📋 Overview

This MCP server provides comprehensive access to all NWO Robotics API endpoints through a unified interface with 77 tools organized by priority and function.

### ✨ Key Features

- **77 Integrated Tools** - Complete API coverage
- **SLAM & Localization** - Persistent robot mapping and navigation
- **Reinforcement Learning** - Cloud RL training (PPO, SAC, DDPG, TD3)
- **Advanced Sensors** - Thermal, MMWave, gas, acoustic, magnetic
- **Vision & Grounding** - Open-vocabulary object detection
- **Tactile Sensing** - ORCA Hand 576-taxel feedback
- **Motion Planning** - MoveIt2 integration with collision avoidance
- **Task Planning** - Hierarchical task execution with behavior trees
- **ROS2 Integration** - Cloud bridge for real robots (UR5e, Panda, Spot)
- **Safety Monitoring** - Real-time safety validation and emergency stop
- **MQTT IoT** - 1000+ agent support with edge computing
- **Autonomous Agents** - Self-registration and ETH-based payments

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/RedCiprianPater/mcp-server-robotics.git
cd mcp-server-robotics
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment
```bash
cp .env.example .env
# Edit .env and add your NWO_API_KEY
nano .env
```

### 4. Build & Run
```bash
npm run build
npm start
```

### 5. Test in Action
```bash
# The server will start and display available tools
# You can now use any of the 77 tools through Claude
```

## 📦 What's Included

### Files
- **src/index.ts** - Complete MCP server implementation (77 tools)
- **package.json** - Dependencies and build scripts
- **tsconfig.json** - TypeScript configuration
- **Dockerfile** - Container deployment
- **docker-compose.yml** - Full stack with MQTT broker
- **.env.example** - Environment variables template
- **INTEGRATION_GUIDE.md** - Detailed integration instructions
- **README.md** - This file

### Tool Categories

#### Priority 1 - Unique Features (5 tools)
```
✅ nwo_initialize_slam              - Persistent robot mapping
✅ nwo_localize                     - Landmark-based localization
✅ nwo_create_rl_env                - Cloud RL training environments
✅ nwo_train_policy                 - Policy training (SB3)
✅ nwo_detect_objects_grounding     - Open-vocabulary detection
```

#### Priority 2 - Novel Sensors (5 tools)
```
✅ nwo_query_thermal                - Heat detection
✅ nwo_query_mmwave                 - Millimeter-wave radar
✅ nwo_query_gas                    - Air quality sensors
✅ nwo_query_acoustic               - Sound localization
✅ nwo_query_magnetic               - Metal detection
```

#### Priority 3 - Advanced Features (4 tools)
```
✅ nwo_read_tactile                 - ORCA Hand 576 taxels
✅ nwo_identify_material            - Material recognition
✅ nwo_plan_motion                  - MoveIt2 motion planning
✅ nwo_execute_behavior_tree        - Hierarchical task execution
```

#### Standard Operations (58 tools)
```
Inference & Models (6)              Robot Control (3)
Task Planning & Learning (4)        Agent Management (3)
Voice & Gesture (2)                 Simulation & Physics (3)
ROS2 & Hardware (3)                 MQTT & IoT (2)
Safety & Monitoring (3)             Embodiment & Calibration (3)
Autonomous Agents (4)               Dataset & Export (2)
Demo & Testing (2)
```

## 🔧 Configuration

### API Key
Get your free API key from https://nwo.capital/webapp/api-key.php

```bash
export NWO_API_KEY="sk_live_your_key_here"
```

### API Endpoints
```bash
# Standard API (full features)
NWO_API_BASE=https://nwo.capital/webapp

# Edge API (ultra-low latency, 200+ locations)
NWO_EDGE_API=https://nwo-robotics-api-edge.ciprianpater.workers.dev/api

# ROS2 Bridge (for physical robots)
NWO_ROS2_BRIDGE=https://nwo-ros2-bridge.onrender.com

# MQTT Broker (IoT sensors)
MQTT_BROKER=mqtt.nwo.capital
MQTT_PORT=8883
```

## 📖 Usage Examples

### Example 1: SLAM & Navigation
```typescript
// Initialize SLAM mapping
const slam = await client.messages.create({
  tools: [{name: "nwo_initialize_slam", input: {
    agent_id: "robot_001",
    map_name: "warehouse",
    slam_type: "hybrid",
    loop_closure: true
  }}]
});

// Later: Localize in the map
const localize = await client.messages.create({
  tools: [{name: "nwo_localize", input: {
    agent_id: "robot_001",
    map_id: "map_123",
    image: "base64_encoded_image"
  }}]
});
```

### Example 2: Vision-Based Task
```typescript
// Detect objects with natural language
const detect = await client.messages.create({
  tools: [{name: "nwo_detect_objects_grounding", input: {
    agent_id: "robot_001",
    image: "base64_image",
    object_description: "red cylinder on the left",
    threshold: 0.85,
    return_mask: true
  }}]
});

// Execute action based on detection
const execute = await client.messages.create({
  tools: [{name: "nwo_inference", input: {
    instruction: "Pick up the detected object",
    images: ["base64_image"]
  }}]
});
```

### Example 3: Complex Task Planning
```typescript
// Break down high-level instruction
const plan = await client.messages.create({
  tools: [{name: "nwo_task_planner", input: {
    instruction: "Clean the warehouse floor",
    agent_id: "robot_001",
    context: {
      location: "warehouse",
      known_objects: ["shelves", "boxes"]
    }
  }}]
});

// Execute subtasks
for (let i = 1; i <= 5; i++) {
  await client.messages.create({
    tools: [{name: "nwo_execute_subtask", input: {
      plan_id: "plan_123",
      subtask_order: i,
      agent_id: "robot_001"
    }}]
  });
}
```

### Example 4: Sensor Fusion
```typescript
const fusion = await client.messages.create({
  tools: [{name: "nwo_sensor_fusion", input: {
    agent_id: "robot_001",
    instruction: "Pick up the hot object carefully",
    images: ["base64_camera"],
    sensors: {
      temperature: {value: 85.5, unit: "celsius"},
      proximity: {distance: 0.15, unit: "meters"},
      force: {grip_pressure: 2.5},
      gps: {lat: 51.5074, lng: -0.1278}
    }
  }}]
});
```

### Example 5: RL Policy Training
```typescript
// Create RL environment
const env = await client.messages.create({
  tools: [{name: "nwo_create_rl_env", input: {
    agent_id: "robot_001",
    task_name: "pick_place",
    reward_function: "success",
    sim_platform: "mujoco"
  }}]
});

// Train policy
const train = await client.messages.create({
  tools: [{name: "nwo_train_policy", input: {
    agent_id: "robot_001",
    env_id: "env_456",
    algorithm: "PPO",
    num_steps: 100000,
    learning_rate: 0.0003
  }}]
});
```

## 📊 Performance Metrics

| Operation | Latency | Notes |
|-----------|---------|-------|
| Standard Inference | 100-120ms | EU datacenter |
| Edge Inference | 25-50ms | Global 200+ locations |
| SLAM Initialization | 200-500ms | Depends on image quality |
| SLAM Localization | 100-300ms | In existing map |
| RL Training (per step) | 50-100ms | MuJoCo simulation |
| Task Planning | 500-1000ms | Complex decomposition |
| Sensor Fusion | 150-300ms | Multi-sensor processing |
| Emergency Stop | <10ms | Guaranteed response |

## 🐳 Docker Deployment

### Simple Docker Run
```bash
docker build -t mcp-nwo-robotics .
docker run -e NWO_API_KEY=sk_xxx mcp-nwo-robotics
```

### Docker Compose (Recommended)
```bash
# Start full stack with MQTT broker
docker-compose up -d

# View logs
docker-compose logs -f mcp-nwo-robotics

# Stop
docker-compose down
```

### Production Deployment
```bash
# Build for production
docker build -t mcp-nwo-robotics:prod .

# Push to registry
docker tag mcp-nwo-robotics:prod myregistry/mcp-nwo-robotics:latest
docker push myregistry/mcp-nwo-robotics:latest

# Deploy on Kubernetes
kubectl apply -f k8s-deployment.yaml
```

## 🔐 Security

### API Key Management
```bash
# Never commit API keys
echo "NWO_API_KEY=*" >> .gitignore
echo ".env" >> .gitignore

# Use environment variables or .env (in .gitignore)
```

### Rate Limiting
- **Free Tier**: 100,000 calls/month
- **Prototype**: 500,000 calls/month (~16,666/day)
- **Production**: Unlimited calls

Monitor usage:
```typescript
const balance = await client.messages.create({
  tools: [{name: "nwo_agent_check_balance", input: {
    agent_id: "agent_123"
  }}]
});
```

### Safety Features
- Real-time collision detection
- Human proximity warning (1.5m default)
- Emergency stop (<10ms response)
- Force/torque limits enforcement
- Audit logging for compliance

## 🧪 Testing

### Run Tests
```bash
npm test
npm run test:watch
```

### Test Individual Tools
```bash
# Test SLAM
npm run dev -- --test nwo_initialize_slam

# Test inference
npm run dev -- --test nwo_inference

# Test sensor fusion
npm run dev -- --test nwo_sensor_fusion
```

## 📚 Documentation

- **API Reference**: https://nwo.capital/webapp/nwo-robotics.html
- **GitHub**: https://github.com/RedCiprianPater/mcp-server-robotics
- **Whitepaper**: https://www.researchgate.net/publication/401902987_NWO_Robotics_API_WHITEPAPER
- **Demo**: https://huggingface.co/spaces/PUBLICAE/nwo-robotics-api-demo
- **Docs**: https://docs.anthropic.com/

## 🔗 Integration Guides

### With Claude API
```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 4096,
  tools: tools, // All 77 NWO tools
  messages: [{
    role: "user",
    content: "Initialize SLAM mapping on robot_001"
  }]
});
```

### With LangChain
```python
from langchain.chat_models import ChatAnthropic
from langchain.tools import StructuredTool

llm = ChatAnthropic(model_name="claude-3-sonnet-20240229")
tools = load_nwo_tools()
agent = initialize_agent(tools, llm, agent="tool-using-agent")
```

### With CrewAI
```python
from crewai import Agent, Task, Crew
from nwo_tools import get_robotics_tools

tools = get_robotics_tools()
robot_agent = Agent(
    role="Robot Controller",
    goal="Control robots autonomously",
    tools=tools
)
```

## 🐛 Troubleshooting

### Issue: "Invalid or missing API key"
```bash
# Solution: Check API key
echo $NWO_API_KEY

# If empty, set it:
export NWO_API_KEY="sk_your_actual_key"

# Or in .env:
NWO_API_KEY=sk_your_actual_key
```

### Issue: "API error 504: Gateway Timeout"
```bash
# Solution: Use edge API for faster response
# Set: NWO_EDGE_API endpoint
# Tool: nwo_edge_inference instead of nwo_inference
```

### Issue: "Collision detected"
```bash
# Solution: Validate trajectory before execution
# Use: nwo_simulate_trajectory to check collision
# Use: nwo_check_collision for detailed analysis
```

### Issue: "SLAM mapping failed"
```bash
# Solution: Ensure good image quality
# - Well-lit environment
# - Distinct visual features
# - Slow movement during initialization
# - Try visual instead of hybrid SLAM
```

## 📈 Monitoring & Analytics

### Logs
```bash
# View real-time logs
npm run dev

# With custom log level
LOG_LEVEL=debug npm start

# Save to file
npm start > logs/server.log 2>&1
```

### Metrics
```bash
# Monitor API usage
nwo_agent_check_balance

# Export dataset for analysis
nwo_export_dataset

# Check system health
GET /health (if enabled)
```

## 🎯 Next Steps

1. ✅ **Setup**: `npm install && npm run build`
2. ✅ **Configure**: Add `NWO_API_KEY` to `.env`
3. ✅ **Test**: `npm start` and verify tools load
4. ✅ **Integrate**: Use with Claude API or your framework
5. ✅ **Deploy**: Docker Compose or Kubernetes
6. ✅ **Monitor**: Check logs and usage metrics
7. ✅ **Scale**: Upgrade tier as needed

## 📞 Support

- **Issues**: https://github.com/RedCiprianPater/mcp-server-robotics/issues
- **Discussions**: https://github.com/RedCiprianPater/mcp-server-robotics/discussions
- **API Key Help**: https://nwo.capital/webapp/api-key.php
- **NWO Docs**: https://nwo.capital/nwo-robotics.html

## 📝 Version History

### v2.0.0 (Current - April 2026)
- ✅ 77 total tools implemented
- ✅ Priority 1: SLAM, RL, Grounding (5)
- ✅ Priority 2: Advanced Sensors (5)
- ✅ Priority 3: Advanced Features (4)
- ✅ Standard Operations (58)
- ✅ Complete TypeScript support
- ✅ Docker & Kubernetes ready
- ✅ Production-grade error handling
- ✅ Full test coverage

### v1.0.0 (Previous)
- Basic tool set (20 tools)
- Standard inference only
- Manual configuration

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- **NWO Robotics** - API and infrastructure
- **Anthropic** - Claude and MCP protocol
- **Open Source Community** - Contributions and feedback

---

**Last Updated**: April 2026  
**Status**: ✅ Production Ready  
**Maintainer**: [@RedCiprianPater](https://github.com/RedCiprianPater)

### ⭐ If you find this useful, please star the repository!

---

## 🔗 Related Projects

- [NWO Robotics API](https://nwo.capital/)
- [Xiaomi Robotics 0](https://huggingface.co/XiaomiRobotics/Xiaomi-Robotics-0)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [Anthropic Claude](https://www.anthropic.com/)
