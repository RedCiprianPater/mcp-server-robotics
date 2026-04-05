# NWO Robotics MCP Server - Complete Integration Guide

## 📋 Overview

This guide explains how to integrate the comprehensive updated `index.ts` with all 77 NWO Robotics tools into your existing MCP server repository.

## 🚀 Quick Start

### 1. Backup Your Current Repository
```bash
cd /path/to/mcp-server-robotics
git add .
git commit -m "Backup before major update"
```

### 2. Replace the index.ts File
```bash
# Copy the updated index.ts to your project
cp /path/to/updated/index.ts src/index.ts
```

### 3. Install Dependencies (if needed)
```bash
npm install
# or
yarn install
```

### 4. Set Environment Variables
```bash
# Create .env file
echo "NWO_API_KEY=sk_your_key_here" > .env

# Or export directly
export NWO_API_KEY="sk_your_key_here"
```

### 5. Test the Server
```bash
npm run build
npm start
```

## 📊 Tool Categories Included

### Priority 1 - Unique Features (5 tools)
- ✅ **nwo_initialize_slam** - Persistent robot mapping
- ✅ **nwo_localize** - Landmark-based localization
- ✅ **nwo_create_rl_env** - Cloud RL training environments
- ✅ **nwo_train_policy** - SB3 policy training (PPO, SAC, DDPG, TD3)
- ✅ **nwo_detect_objects_grounding** - Open-vocabulary detection

### Priority 2 - Novel Sensors (5 tools)
- ✅ **nwo_query_thermal** - Heat detection & monitoring
- ✅ **nwo_query_mmwave** - Millimeter-wave radar sensing
- ✅ **nwo_query_gas** - Air quality & gas detection
- ✅ **nwo_query_acoustic** - Sound localization & anomaly detection
- ✅ **nwo_query_magnetic** - Metal detection

### Priority 3 - Advanced Features (4 tools)
- ✅ **nwo_read_tactile** - ORCA Hand 576 taxel sensors
- ✅ **nwo_identify_material** - Surface texture & material ID
- ✅ **nwo_plan_motion** - MoveIt2 motion planning
- ✅ **nwo_execute_behavior_tree** - Hierarchical task execution

### Standard Operations (58 tools)
- Inference & Models (6)
- Robot Control & State (3)
- Task Planning & Learning (4)
- Agent Management (3)
- Voice & Gesture Control (2)
- Simulation & Physics (3)
- ROS2 & Hardware (3)
- MQTT & IoT (2)
- Safety & Monitoring (3)
- Embodiment & Calibration (3)
- Autonomous Agents (4)
- Dataset & Export (2)
- Demo & Testing (2)

**Total: 77 Tools**

## 🔧 Configuration

### API Keys
```typescript
// In index.ts, update:
const NWO_API_KEY = process.env.NWO_API_KEY || "sk_your_key_here";
```

### API Endpoints
```typescript
// Update if your endpoints differ:
const NWO_API_BASE = "https://nwo.capital/webapp";
const NWO_EDGE_API = "https://nwo-robotics-api-edge.ciprianpater.workers.dev/api";
const NWO_ROS2_BRIDGE = "https://nwo-ros2-bridge.onrender.com";
const MQTT_BROKER = "mqtt.nwo.capital";
const MQTT_PORT = 8883;
```

## 🧠 Tool Usage Examples

### Example 1: SLAM Initialization & Localization
```json
{
  "tool": "nwo_initialize_slam",
  "input": {
    "agent_id": "robot_001",
    "map_name": "warehouse_floor_1",
    "slam_type": "hybrid",
    "loop_closure": true
  }
}
```

Then localize:
```json
{
  "tool": "nwo_localize",
  "input": {
    "agent_id": "robot_001",
    "map_id": "map_123",
    "image": "base64_encoded_image"
  }
}
```

### Example 2: RL Policy Training
```json
{
  "tool": "nwo_create_rl_env",
  "input": {
    "agent_id": "robot_001",
    "task_name": "pick_place",
    "reward_function": "success",
    "sim_platform": "mujoco"
  }
}
```

Then train:
```json
{
  "tool": "nwo_train_policy",
  "input": {
    "agent_id": "robot_001",
    "env_id": "rl_env_456",
    "algorithm": "PPO",
    "num_steps": 100000,
    "learning_rate": 0.0003
  }
}
```

### Example 3: Sensor Fusion with Safety
```json
{
  "tool": "nwo_sensor_fusion",
  "input": {
    "agent_id": "robot_001",
    "instruction": "Pick up the hot object carefully",
    "images": ["base64_camera..."],
    "sensors": {
      "temperature": {"value": 85.5, "unit": "celsius"},
      "proximity": {"distance": 0.15, "unit": "meters"},
      "force": {"grip_pressure": 2.5}
    }
  }
}
```

### Example 4: Multi-Sensor Detection
```json
{
  "tool": "nwo_detect_objects_grounding",
  "input": {
    "agent_id": "robot_001",
    "image": "base64_encoded_image",
    "object_description": "red cylinder on the left side",
    "threshold": 0.85,
    "return_mask": true
  }
}
```

### Example 5: Complex Task Planning
```json
{
  "tool": "nwo_task_planner",
  "input": {
    "instruction": "Clean the warehouse",
    "agent_id": "robot_001",
    "context": {
      "location": "warehouse",
      "known_objects": ["shelves", "boxes", "cleaning_supplies"]
    }
  }
}
```

## 📡 API Endpoint Mapping

Each tool maps to a specific NWO API endpoint:

| Tool Name | Endpoint | Method |
|-----------|----------|--------|
| nwo_initialize_slam | `/api-slam.php?action=initialize` | POST |
| nwo_localize | `/api-slam.php?action=localize` | POST |
| nwo_create_rl_env | `/api-rl.php?action=create_env` | POST |
| nwo_train_policy | `/api-rl.php?action=train_policy` | POST |
| nwo_detect_objects_grounding | `/api-vision.php?action=grounding` | POST |
| nwo_query_thermal | `/api-sensors.php?action=thermal` | POST |
| nwo_query_mmwave | `/api-sensors.php?action=mmwave` | POST |
| nwo_query_gas | `/api-sensors.php?action=gas` | POST |
| nwo_query_acoustic | `/api-sensors.php?action=acoustic` | POST |
| nwo_query_magnetic | `/api-sensors.php?action=magnetic` | POST |
| nwo_read_tactile | `/api-orca.php?action=read_tactile` | POST |
| nwo_identify_material | `/api-perception.php?action=identify_material` | POST |
| nwo_plan_motion | `/api-planning.php?action=plan_motion` | POST |
| nwo_execute_behavior_tree | `/api-tasks.php?action=execute_behavior_tree` | POST |
| nwo_inference | `/api-robotics.php?action=inference` | POST |
| nwo_edge_inference | Edge API `/api/inference` | POST |

## 🔌 Integration with Existing Code

### Package.json Setup
```json
{
  "name": "mcp-server-nwo-robotics",
  "version": "2.0.0",
  "description": "Complete MCP server for NWO Robotics API",
  "main": "src/index.ts",
  "scripts": {
    "build": "tsc",
    "start": "node --loader ts-node/esm src/index.ts",
    "dev": "ts-node src/index.ts",
    "test": "jest"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "latest"
  },
  "devDependencies": {
    "@types/node": "latest",
    "typescript": "latest",
    "ts-node": "latest"
  }
}
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## 🔐 Security Considerations

### API Key Management
```bash
# Never commit API keys
echo "NWO_API_KEY=*" >> .gitignore

# Use environment variables
export NWO_API_KEY="sk_live_xxx"

# Or use .env file (add to .gitignore)
NWO_API_KEY=sk_live_xxx
```

### Rate Limiting & Quota
- Free tier: 100,000 calls/month
- Prototype: 500,000 calls/month
- Production: Unlimited

Monitor usage with:
```json
{
  "tool": "nwo_agent_check_balance",
  "input": {
    "agent_id": "your_agent_id"
  }
}
```

## 🧪 Testing Tools Locally

### Test SLAM
```typescript
const slamTest = {
  tool: "nwo_initialize_slam",
  input: {
    agent_id: "test_robot",
    map_name: "test_map",
    slam_type: "visual",
    loop_closure: false
  }
};
```

### Test Inference
```typescript
const inferenceTest = {
  tool: "nwo_inference",
  input: {
    instruction: "Move to the right",
    images: ["base64_image_data"]
  }
};
```

## 📚 Documentation References

- **NWO Robotics API**: https://nwo.capital/webapp/nwo-robotics.html
- **GitHub Repository**: https://github.com/RedCiprianPater/mcp-server-robotics
- **API Whitepaper**: https://www.researchgate.net/publication/401902987_NWO_Robotics_API_WHITEPAPER
- **Hugging Face Demo**: https://huggingface.co/spaces/PUBLICAE/nwo-robotics-api-demo

## 🐛 Troubleshooting

### Issue: API Key Error
```
Error: Invalid or missing API key
```
**Solution:**
```bash
export NWO_API_KEY="your_actual_key"
echo $NWO_API_KEY  # Verify it's set
```

### Issue: Connection Timeout
```
Error: API error 504: Gateway Timeout
```
**Solution:** Use edge API for faster response
```json
{
  "tool": "nwo_edge_inference",
  "input": {
    "instruction": "your command"
  }
}
```

### Issue: Collision Detection Failing
```
Error: Safety check failed
```
**Solution:** Check for obstacles and adjust trajectory
```json
{
  "tool": "nwo_simulate_trajectory",
  "input": {
    "trajectory": [...],
    "check_collision": true
  }
}
```

## 📈 Performance Metrics

Expected response times:
- Standard inference: ~100-120ms
- Edge inference: ~25-50ms
- SLAM operations: ~200-500ms
- RL training (per step): ~50-100ms
- Task planning: ~500-1000ms

## 🚀 Deployment

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY src ./src
COPY tsconfig.json ./
RUN npm run build
CMD ["node", "dist/index.js"]
```

### Build & Deploy
```bash
npm run build
docker build -t mcp-nwo-robotics .
docker run -e NWO_API_KEY=sk_xxx mcp-nwo-robotics
```

## 📞 Support

- **Issues**: Create an issue in the GitHub repository
- **Questions**: Check the NWO Robotics documentation
- **API Key**: Get one at https://nwo.capital/webapp/api-key.php

## 📝 Changelog

### Version 2.0.0 (Current)
- ✅ Added 5 Priority 1 tools (SLAM, RL, Grounding)
- ✅ Added 5 Priority 2 sensors (Thermal, MMWave, Gas, Acoustic, Magnetic)
- ✅ Added 4 Priority 3 features (Tactile, Material ID, Motion Planning, Behavior Trees)
- ✅ Complete endpoint coverage (77 total tools)
- ✅ Enhanced error handling
- ✅ Full TypeScript support

## 🎯 Next Steps

1. ✅ Copy `index.ts` to `src/index.ts`
2. ✅ Update environment variables
3. ✅ Run `npm install && npm run build`
4. ✅ Test with `npm start`
5. ✅ Deploy to production

---

**Last Updated:** April 2026  
**Status:** Production Ready ✅
