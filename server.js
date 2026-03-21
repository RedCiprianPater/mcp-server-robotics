#!/usr/bin/env node

/**
 * NWO Robotics MCP Server
 * Model Context Protocol implementation for robot control
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

const API_BASE = process.env.NWO_API_BASE || 'https://nwo.capital/webapp';
const API_KEY = process.env.NWO_API_KEY;
const AGENT_ID = process.env.NWO_AGENT_ID;

class NWORoboticsMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'nwo-robotics',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_robot_status',
            description: 'Get status of all connected robots',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'execute_robot_task',
            description: 'Send a Vision-Language-Action command to a robot',
            inputSchema: {
              type: 'object',
              properties: {
                robot_id: {
                  type: 'string',
                  description: 'ID of the robot to control',
                },
                instruction: {
                  type: 'string',
                  description: 'Natural language instruction (e.g., "Move to loading dock")',
                },
                coordinates: {
                  type: 'object',
                  properties: {
                    x: { type: 'number' },
                    y: { type: 'number' },
                  },
                  description: 'Optional target coordinates',
                },
              },
              required: ['robot_id', 'instruction'],
            },
          },
          {
            name: 'stop_robot',
            description: 'Emergency stop a robot',
            inputSchema: {
              type: 'object',
              properties: {
                robot_id: {
                  type: 'string',
                  description: 'ID of the robot to stop',
                },
              },
              required: ['robot_id'],
            },
          },
          {
            name: 'query_sensors',
            description: 'Query IoT sensors by location',
            inputSchema: {
              type: 'object',
              properties: {
                location: {
                  type: 'string',
                  description: 'Location to query (e.g., "warehouse_1")',
                },
                sensor_type: {
                  type: 'string',
                  description: 'Type of sensor (temperature, humidity, motion, etc.)',
                },
              },
              required: ['location'],
            },
          },
          {
            name: 'check_balance',
            description: 'Check API quota usage and tier status',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'register_agent',
            description: 'Self-register as a new AI agent (if not already registered)',
            inputSchema: {
              type: 'object',
              properties: {
                wallet_address: {
                  type: 'string',
                  description: 'Ethereum wallet address (0x...)',
                },
                agent_name: {
                  type: 'string',
                  description: 'Name for this agent',
                },
                capabilities: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of capabilities (vision, navigation, manipulation, iot)',
                },
              },
              required: ['wallet_address', 'agent_name'],
            },
          },
          {
            name: 'detect_objects',
            description: 'Run computer vision to detect objects',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'What to look for (e.g., "red boxes", "people")',
                },
                camera_id: {
                  type: 'string',
                  description: 'Camera to use (optional)',
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_agent_info',
            description: 'Get information about the current agent account',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_robot_status':
            return await this.getRobotStatus();
          
          case 'execute_robot_task':
            return await this.executeRobotTask(args);
          
          case 'stop_robot':
            return await this.stopRobot(args);
          
          case 'query_sensors':
            return await this.querySensors(args);
          
          case 'check_balance':
            return await this.checkBalance();
          
          case 'register_agent':
            return await this.registerAgent(args);
          
          case 'detect_objects':
            return await this.detectObjects(args);
          
          case 'get_agent_info':
            return await this.getAgentInfo();
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async getRobotStatus() {
    const response = await axios.post(
      `${API_BASE}/api-robotics.php`,
      { action: 'get_agent_status' },
      { headers: { 'X-API-Key': API_KEY } }
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  async executeRobotTask(args) {
    const response = await axios.post(
      `${API_BASE}/api-robotics.php`,
      {
        action: 'execute_task',
        robot_id: args.robot_id,
        instruction: args.instruction,
        coordinates: args.coordinates,
      },
      { headers: { 'X-API-Key': API_KEY } }
    );
    
    return {
      content: [
        {
          type: 'text',
          text: `Task executed: ${response.data.status || 'success'}`,
        },
      ],
    };
  }

  async stopRobot(args) {
    const response = await axios.post(
      `${API_BASE}/api-safety.php`,
      {
        action: 'emergency_stop',
        robot_id: args.robot_id,
      },
      { headers: { 'X-API-Key': API_KEY } }
    );
    
    return {
      content: [
        {
          type: 'text',
          text: `Robot ${args.robot_id} stopped successfully`,
        },
      ],
    };
  }

  async querySensors(args) {
    const response = await axios.post(
      `${API_BASE}/api-iot.php`,
      {
        action: 'query_sensors',
        location: args.location,
        sensor_type: args.sensor_type,
      },
      { headers: { 'X-API-Key': API_KEY } }
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  async checkBalance() {
    const response = await axios.get(
      `${API_BASE}/api-agent-balance.php`,
      {
        headers: {
          'X-API-Key': API_KEY,
          'X-Agent-ID': AGENT_ID,
        },
      }
    );
    
    const data = response.data;
    return {
      content: [
        {
          type: 'text',
          text: `Tier: ${data.agent.tier}\n` +
                `Quota Used: ${data.quota.used_this_month}\n` +
                `Remaining: ${data.quota.remaining}\n` +
                `Expires: ${data.subscription.expires_at || 'N/A'}`,
        },
      ],
    };
  }

  async registerAgent(args) {
    const response = await axios.post(
      `${API_BASE}/api-agent-register.php`,
      {
        wallet_address: args.wallet_address,
        agent_name: args.agent_name,
        capabilities: args.capabilities || ['vision', 'navigation'],
      }
    );
    
    const data = response.data;
    return {
      content: [
        {
          type: 'text',
          text: `Agent registered!\n` +
                `Agent ID: ${data.agent_id}\n` +
                `API Key: ${data.api_key_prefix}...\n` +
                `Tier: ${data.tier}\n` +
                `Monthly Quota: ${data.monthly_quota}\n\n` +
                `IMPORTANT: Save your API key securely!`,
        },
      ],
    };
  }

  async detectObjects(args) {
    const response = await axios.post(
      `${API_BASE}/api-perception.php`,
      {
        action: 'detect_objects',
        query: args.query,
        camera_id: args.camera_id,
      },
      { headers: { 'X-API-Key': API_KEY } }
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  async getAgentInfo() {
    const response = await axios.get(
      `${API_BASE}/api-agent-balance.php`,
      {
        headers: {
          'X-API-Key': API_KEY,
          'X-Agent-ID': AGENT_ID,
        },
      }
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data.agent, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('NWO Robotics MCP Server running on stdio');
  }
}

const server = new NWORoboticsMCPServer();
server.run().catch(console.error);
