#!/usr/bin/env node

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// Configuration
const NWO_API_BASE = "https://nwo.capital/webapp";
const NWO_EDGE_API = "https://nwo-robotics-api-edge.ciprianpater.workers.dev/api";
const NWO_ROS2_BRIDGE = "https://nwo-ros2-bridge.onrender.com";
const NWO_API_KEY = process.env.NWO_API_KEY || "sk_your_key_here";
const MQTT_BROKER = "mqtt.nwo.capital";
const MQTT_PORT = 8883;

// Tool Definitions
const tools: Anthropic.Tool[] = [
  // ============================================================================
  // PRIORITY 1 - UNIQUE FEATURES (Most Differentiated)
  // ============================================================================

  // SLAM & Localization
  {
    name: "nwo_initialize_slam",
    description:
      "Initialize SLAM (Simultaneous Localization and Mapping) for persistent robot mapping. Creates a continuous spatial map of the environment that the robot remembers across sessions.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Unique robot/agent identifier",
        },
        map_name: {
          type: "string",
          description: "Name for the SLAM map to create",
        },
        slam_type: {
          type: "string",
          enum: ["visual", "lidar", "hybrid"],
          description: "Type of SLAM to use (visual, lidar, or hybrid)",
        },
        loop_closure: {
          type: "boolean",
          description: "Enable loop closure detection for long-term mapping",
        },
      },
      required: ["agent_id", "map_name"],
    },
  },

  {
    name: "nwo_localize",
    description:
      "Localize robot within existing SLAM map. The robot remembers previously mapped areas and localizes without re-mapping.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        map_id: {
          type: "string",
          description: "ID of previously created SLAM map",
        },
        image: {
          type: "string",
          description: "Base64 encoded camera image for localization",
        },
        sensor_data: {
          type: "object",
          description: "Additional sensor data (GPS, LiDAR point cloud)",
        },
      },
      required: ["agent_id", "map_id"],
    },
  },

  // Reinforcement Learning
  {
    name: "nwo_create_rl_env",
    description:
      "Create cloud-hosted RL environment for training robot policies. First cloud RL training system optimized for physical robots.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        task_name: {
          type: "string",
          description: "Name of the task to train on (e.g., 'pick_place')",
        },
        reward_function: {
          type: "string",
          description: "Reward function definition (success, time_efficient, smooth_motion)",
        },
        sim_platform: {
          type: "string",
          enum: ["mujoco", "isaac_sim", "bullet", "unity_ml"],
          description: "Physics simulation platform",
        },
        initial_policy: {
          type: "string",
          description: "Optional base policy model to fine-tune",
        },
      },
      required: ["agent_id", "task_name", "reward_function"],
    },
  },

  {
    name: "nwo_train_policy",
    description:
      "Train robot policy using Stable Baselines 3 (SB3) integration. Includes PPO, SAC, and DDPG algorithms with Sim-to-Real transfer.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        env_id: {
          type: "string",
          description: "RL environment ID to train on",
        },
        algorithm: {
          type: "string",
          enum: ["PPO", "SAC", "DDPG", "TD3"],
          description: "RL algorithm to use",
        },
        num_steps: {
          type: "number",
          description: "Number of training steps",
        },
        learning_rate: {
          type: "number",
          description: "Learning rate for policy optimization",
        },
        net_arch: {
          type: "string",
          description: "Network architecture (small, medium, large)",
        },
      },
      required: ["agent_id", "env_id", "algorithm"],
    },
  },

  {
    name: "nwo_detect_objects_grounding",
    description:
      "Open-vocabulary object detection with visual grounding. Detect any object by natural language description without requiring training.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        image: {
          type: "string",
          description: "Base64 encoded camera image",
        },
        object_description: {
          type: "string",
          description: "Natural language description of object to detect",
        },
        threshold: {
          type: "number",
          description: "Confidence threshold (0.0-1.0)",
        },
        return_mask: {
          type: "boolean",
          description: "Return segmentation mask for object",
        },
      },
      required: ["agent_id", "image", "object_description"],
    },
  },

  // ============================================================================
  // PRIORITY 2 - NOVEL SENSORS (Advanced Perception)
  // ============================================================================

  {
    name: "nwo_query_thermal",
    description:
      "Thermal imaging sensor query. Detect heat sources and temperature distributions for safety monitoring and object detection.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        temperature_range: {
          type: "object",
          properties: {
            min_celsius: { type: "number" },
            max_celsius: { type: "number" },
          },
          description: "Temperature range to detect",
        },
        detection_mode: {
          type: "string",
          enum: ["objects", "humans", "hotspots", "all"],
          description: "What to detect",
        },
      },
      required: ["agent_id"],
    },
  },

  {
    name: "nwo_query_mmwave",
    description:
      "Millimeter-wave radar sensing. Detect moving objects and people through obstacles with sub-centimeter accuracy.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        range_meters: {
          type: "number",
          description: "Detection range in meters",
        },
        detection_type: {
          type: "string",
          enum: ["static", "moving", "all"],
          description: "What to detect",
        },
        velocity_estimate: {
          type: "boolean",
          description: "Estimate velocity of moving objects",
        },
      },
      required: ["agent_id"],
    },
  },

  {
    name: "nwo_query_gas",
    description:
      "Gas/air quality sensor array. Detect harmful gases, air quality, and environmental hazards.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        gas_types: {
          type: "array",
          items: {
            type: "string",
            enum: ["CO2", "CO", "VOC", "PM2.5", "PM10", "O3"],
          },
          description: "Gases to measure",
        },
        alert_threshold: {
          type: "object",
          description: "Alert thresholds for each gas type",
        },
      },
      required: ["agent_id", "gas_types"],
    },
  },

  {
    name: "nwo_query_acoustic",
    description:
      "Acoustic sensor for sound localization and anomaly detection. Detect loud noises, broken equipment, or dangerous sounds.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        detection_mode: {
          type: "string",
          enum: ["localization", "anomaly", "speech", "impact"],
          description: "What to detect",
        },
        frequency_range: {
          type: "object",
          properties: {
            min_hz: { type: "number" },
            max_hz: { type: "number" },
          },
          description: "Frequency range to monitor",
        },
      },
      required: ["agent_id"],
    },
  },

  {
    name: "nwo_query_magnetic",
    description:
      "Magnetometer sensor. Detect metal objects, magnetic fields, and metallic contamination.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        sensitivity: {
          type: "string",
          enum: ["low", "medium", "high"],
          description: "Sensor sensitivity",
        },
        detect_ferrous: {
          type: "boolean",
          description: "Detect ferrous (iron-based) metals",
        },
        detect_non_ferrous: {
          type: "boolean",
          description: "Detect non-ferrous metals (copper, aluminum)",
        },
      },
      required: ["agent_id"],
    },
  },

  // ============================================================================
  // PRIORITY 3 - ADVANCED FEATURES (Complex Operations)
  // ============================================================================

  {
    name: "nwo_read_tactile",
    description:
      "Read ORCA Hand tactile sensors. 576 individual taxels (16x16 per fingertip x 5 fingers) for force feedback and slip detection.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier with ORCA hand",
        },
        finger: {
          type: "string",
          enum: ["thumb", "index", "middle", "ring", "pinky", "all"],
          description: "Which finger to read",
        },
        data_type: {
          type: "string",
          enum: ["raw_taxels", "force_vector", "slip_detection", "texture_id"],
          description: "Type of tactile data",
        },
        calibration_mode: {
          type: "boolean",
          description: "Run self-calibration before reading",
        },
      },
      required: ["agent_id"],
    },
  },

  {
    name: "nwo_identify_material",
    description:
      "Identify material properties from tactile and visual feedback. Detect surface texture, hardness, temperature, and material type.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        image: {
          type: "string",
          description: "Base64 encoded image of material",
        },
        tactile_data: {
          type: "object",
          description: "Tactile sensor readings if available",
        },
        material_categories: {
          type: "array",
          items: { type: "string" },
          description: "Expected material types (metal, plastic, wood, rubber, fabric)",
        },
      },
      required: ["agent_id", "image"],
    },
  },

  {
    name: "nwo_plan_motion",
    description:
      "MoveIt2 motion planning integration. Plan collision-free trajectories using RRT-Connect, OMPL, and CHOMP algorithms.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        start_pose: {
          type: "object",
          description: "Starting joint configuration",
        },
        goal_pose: {
          type: "object",
          description: "Goal joint configuration or end-effector pose",
        },
        planner: {
          type: "string",
          enum: ["RRTConnect", "PRM", "CHOMP", "STOMP"],
          description: "Motion planning algorithm",
        },
        avoid_collisions: {
          type: "boolean",
          description: "Enable collision avoidance",
        },
        planning_time_seconds: {
          type: "number",
          description: "Time allowed for planning",
        },
      },
      required: ["agent_id", "goal_pose"],
    },
  },

  {
    name: "nwo_execute_behavior_tree",
    description:
      "Execute hierarchical task execution using Behavior Trees. Complex task orchestration with conditional logic and error recovery.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        behavior_tree: {
          type: "object",
          description: "Behavior tree XML/JSON definition",
        },
        tree_name: {
          type: "string",
          description: "Predefined tree name (morning_routine, inspection, etc.)",
        },
        parameters: {
          type: "object",
          description: "Runtime parameters for tree execution",
        },
        execution_mode: {
          type: "string",
          enum: ["simulation", "real"],
          description: "Simulation or real execution",
        },
      },
      required: ["agent_id"],
    },
  },

  // ============================================================================
  // STANDARD INFERENCE & MODEL ENDPOINTS
  // ============================================================================

  {
    name: "nwo_inference",
    description:
      "Standard vision-language-action (VLA) inference. Send camera images and natural language instructions to get robot actions.",
    input_schema: {
      type: "object" as const,
      properties: {
        instruction: {
          type: "string",
          description: "Natural language instruction for the robot",
        },
        images: {
          type: "array",
          items: { type: "string" },
          description: "Base64 encoded camera images",
        },
        model_id: {
          type: "string",
          description: "Specific model to use (default: xiaomi-robotics-0)",
        },
      },
      required: ["instruction"],
    },
  },

  {
    name: "nwo_inference_with_router",
    description:
      "Intelligent model router inference. Automatically selects the best model for the task based on classification.",
    input_schema: {
      type: "object" as const,
      properties: {
        instruction: {
          type: "string",
          description: "Natural language instruction",
        },
        images: {
          type: "array",
          items: { type: "string" },
          description: "Base64 encoded images",
        },
        task_type: {
          type: "string",
          enum: ["grasp", "navigate", "ocr", "manipulation", "inspection"],
          description: "Optional task type hint",
        },
      },
      required: ["instruction"],
    },
  },

  {
    name: "nwo_edge_inference",
    description:
      "Ultra-low latency inference via global edge network (200+ locations). <50ms response time worldwide.",
    input_schema: {
      type: "object" as const,
      properties: {
        instruction: {
          type: "string",
          description: "Natural language instruction",
        },
        images: {
          type: "array",
          items: { type: "string" },
          description: "Base64 encoded images",
        },
        priority: {
          type: "string",
          enum: ["low", "normal", "high"],
          description: "Request priority",
        },
      },
      required: ["instruction"],
    },
  },

  {
    name: "nwo_list_models",
    description: "List all available models with their capabilities and status.",
    input_schema: {
      type: "object" as const,
      properties: {
        filter_type: {
          type: "string",
          enum: ["all", "vla", "ocr", "vision_language"],
          description: "Filter by model type",
        },
      },
    },
  },

  {
    name: "nwo_get_model_info",
    description: "Get detailed information about a specific model.",
    input_schema: {
      type: "object" as const,
      properties: {
        model_id: {
          type: "string",
          description: "Model identifier",
        },
      },
      required: ["model_id"],
    },
  },

  // ============================================================================
  // ROBOT CONTROL & STATE
  // ============================================================================

  {
    name: "nwo_query_robot_state",
    description:
      "Query current robot state including joint positions, gripper state, battery level, and sensor readings.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        include_image: {
          type: "boolean",
          description: "Include base64 camera image",
        },
        sensor_data: {
          type: "array",
          items: {
            type: "string",
            enum: ["joints", "gripper", "battery", "imu", "lidar", "camera"],
          },
          description: "Specific sensor data to include",
        },
      },
      required: ["agent_id"],
    },
  },

  {
    name: "nwo_execute_actions",
    description: "Execute a sequence of robot actions with safety checks and progress tracking.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        actions: {
          type: "array",
          items: { type: "array" },
          description: "Array of action sequences [[x,y,z], ...]",
        },
        safety_check: {
          type: "boolean",
          description: "Enable collision detection",
        },
        speed: {
          type: "number",
          description: "Execution speed (0.0-1.0)",
        },
      },
      required: ["agent_id", "actions"],
    },
  },

  {
    name: "nwo_sensor_fusion",
    description:
      "Fuse multiple IoT sensors (GPS, LiDAR, temperature, proximity, force, camera) for context-aware decisions.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        instruction: {
          type: "string",
          description: "Task instruction",
        },
        images: {
          type: "array",
          items: { type: "string" },
          description: "Camera images",
        },
        sensors: {
          type: "object",
          description: "Sensor readings (temperature, proximity, force, GPS, LiDAR)",
        },
      },
      required: ["agent_id", "instruction"],
    },
  },

  // ============================================================================
  // TASK PLANNING & LEARNING
  // ============================================================================

  {
    name: "nwo_task_planner",
    description:
      "Break down complex high-level instructions into executable subtasks. AI analyzes and creates ordered plan.",
    input_schema: {
      type: "object" as const,
      properties: {
        instruction: {
          type: "string",
          description: "High-level task description",
        },
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        context: {
          type: "object",
          description: "Environment context (location, known objects)",
        },
      },
      required: ["instruction", "agent_id"],
    },
  },

  {
    name: "nwo_execute_subtask",
    description: "Execute a specific subtask from a generated plan with progress tracking.",
    input_schema: {
      type: "object" as const,
      properties: {
        plan_id: {
          type: "string",
          description: "Plan identifier",
        },
        subtask_order: {
          type: "number",
          description: "Subtask order number",
        },
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
      },
      required: ["plan_id", "subtask_order", "agent_id"],
    },
  },

  {
    name: "nwo_get_learning_recommendations",
    description:
      "Get AI-recommended approaches based on historical data and similar completed tasks.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        task_description: {
          type: "string",
          description: "Task description",
        },
        context: {
          type: "object",
          description: "Task context",
        },
      },
      required: ["agent_id", "task_description"],
    },
  },

  {
    name: "nwo_log_task_execution",
    description:
      "Log task execution results to improve future recommendations and train learning system.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        task_description: {
          type: "string",
          description: "Task description",
        },
        technique_used: {
          type: "string",
          description: "Technique/approach used",
        },
        success: {
          type: "boolean",
          description: "Whether task succeeded",
        },
        execution_time_ms: {
          type: "number",
          description: "Time taken in milliseconds",
        },
        sensor_data: {
          type: "object",
          description: "Sensor readings during execution",
        },
      },
      required: ["agent_id", "task_description", "success"],
    },
  },

  // ============================================================================
  // AGENT MANAGEMENT
  // ============================================================================

  {
    name: "nwo_register_agent",
    description: "Register a new robot/agent with the API to enable tracking and control.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Unique agent identifier",
        },
        name: {
          type: "string",
          description: "Human-readable name",
        },
        type: {
          type: "string",
          enum: ["arm", "mobile", "humanoid", "mobile_arm", "custom"],
          description: "Robot type",
        },
        capabilities: {
          type: "array",
          items: { type: "string" },
          description: "Robot capabilities",
        },
        hardware: {
          type: "object",
          description: "Hardware specs (DOF, max lift, sensors)",
        },
      },
      required: ["agent_id", "name", "type", "capabilities"],
    },
  },

  {
    name: "nwo_update_agent",
    description: "Update agent capabilities or configuration.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        capabilities: {
          type: "array",
          items: { type: "string" },
          description: "Updated capabilities",
        },
        status: {
          type: "string",
          enum: ["active", "inactive", "maintenance"],
          description: "Agent status",
        },
        metadata: {
          type: "object",
          description: "Additional metadata",
        },
      },
      required: ["agent_id"],
    },
  },

  {
    name: "nwo_get_agent_info",
    description: "Get complete information about a registered agent.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
      },
      required: ["agent_id"],
    },
  },

  // ============================================================================
  // VOICE & GESTURE CONTROL
  // ============================================================================

  {
    name: "nwo_detect_gesture",
    description:
      "Real-time hand gesture recognition for intuitive robot control. Wave to stop, point to direct, draw paths.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        video_stream: {
          type: "string",
          description: "Video stream URL (rtsp://...) or base64 image",
        },
        gestures: {
          type: "array",
          items: { type: "string" },
          description: "Gestures to detect (wave, point, stop, thumbsup)",
        },
      },
      required: ["agent_id"],
    },
  },

  {
    name: "nwo_process_voice_command",
    description:
      "Voice-activated robot control. Wake word detection and natural language command parsing.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        audio: {
          type: "string",
          description: "Base64 encoded audio data",
        },
        wake_word: {
          type: "string",
          description: "Wake word to listen for (default: 'Hey Robot')",
        },
        language: {
          type: "string",
          description: "Language code (en, es, fr, de, zh)",
        },
      },
      required: ["agent_id", "audio"],
    },
  },

  // ============================================================================
  // SIMULATION & PHYSICS
  // ============================================================================

  {
    name: "nwo_simulate_trajectory",
    description:
      "Cloud-hosted physics simulation for trajectory validation. High-fidelity MuJoCo simulation.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        trajectory: {
          type: "array",
          items: { type: "array" },
          description: "Joint trajectory to simulate",
        },
        physics_params: {
          type: "object",
          description: "Physics parameters (gravity, friction)",
        },
        check_collision: {
          type: "boolean",
          description: "Check for collisions",
        },
      },
      required: ["agent_id", "trajectory"],
    },
  },

  {
    name: "nwo_check_collision",
    description: "Check if trajectory violates collision constraints.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        trajectory: {
          type: "array",
          items: { type: "array" },
          description: "Joint trajectory",
        },
        environment: {
          type: "object",
          description: "Environment obstacles",
        },
      },
      required: ["agent_id", "trajectory"],
    },
  },

  {
    name: "nwo_cosmos_generate_scene",
    description:
      "NVIDIA Cosmos 3 scene generation. Create photorealistic training environments from text descriptions.",
    input_schema: {
      type: "object" as const,
      properties: {
        prompt: {
          type: "string",
          description: "Text description of scene",
        },
        objects: {
          type: "array",
          items: { type: "string" },
          description: "Objects to include",
        },
        lighting: {
          type: "string",
          enum: ["industrial", "office", "warehouse", "home", "outdoor"],
          description: "Lighting type",
        },
        variations: {
          type: "number",
          description: "Number of scene variations to generate",
        },
      },
      required: ["prompt"],
    },
  },

  // ============================================================================
  // ROS2 & HARDWARE INTEGRATION
  // ============================================================================

  {
    name: "nwo_connect_ros2_robot",
    description:
      "Connect NWO API to ROS2-enabled robot via WebSocket bridge. Supports UR5e, Panda, Spot, and generic robots.",
    input_schema: {
      type: "object" as const,
      properties: {
        robot_id: {
          type: "string",
          description: "Unique robot identifier",
        },
        robot_type: {
          type: "string",
          enum: ["ur5e", "panda", "spot", "generic_ros2"],
          description: "Type of robot",
        },
        ros_namespace: {
          type: "string",
          description: "ROS2 namespace (e.g., /robot_0)",
        },
        bridge_mode: {
          type: "string",
          enum: ["cloud", "edge"],
          description: "Cloud bridge (50-200ms) or edge (local)",
        },
      },
      required: ["robot_id", "robot_type"],
    },
  },

  {
    name: "nwo_send_ros2_action",
    description: "Send action directly to ROS2 robot through the bridge.",
    input_schema: {
      type: "object" as const,
      properties: {
        robot_id: {
          type: "string",
          description: "Robot identifier",
        },
        action_type: {
          type: "string",
          description: "ROS2 action type",
        },
        goal: {
          type: "object",
          description: "Action goal",
        },
      },
      required: ["robot_id", "action_type", "goal"],
    },
  },

  {
    name: "nwo_get_ros2_state",
    description: "Get robot state from ROS2 topics.",
    input_schema: {
      type: "object" as const,
      properties: {
        robot_id: {
          type: "string",
          description: "Robot identifier",
        },
        topics: {
          type: "array",
          items: { type: "string" },
          description: "ROS2 topics to read",
        },
      },
      required: ["robot_id"],
    },
  },

  // ============================================================================
  // MQTT & IoT
  // ============================================================================

  {
    name: "nwo_mqtt_publish",
    description:
      "Publish sensor data or commands via MQTT to the NWO IoT network. Supports 1000+ agents.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Agent identifier",
        },
        topic: {
          type: "string",
          description: "MQTT topic (e.g., nwo/agents/robot_001/sensors)",
        },
        message: {
          type: "object",
          description: "Message payload",
        },
        qos: {
          type: "number",
          enum: [0, 1, 2],
          description: "Quality of Service",
        },
      },
      required: ["agent_id", "topic", "message"],
    },
  },

  {
    name: "nwo_mqtt_subscribe",
    description:
      "Subscribe to MQTT topics for real-time sensor data and command updates.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Agent identifier",
        },
        topics: {
          type: "array",
          items: { type: "string" },
          description: "MQTT topics to subscribe to",
        },
        callback: {
          type: "string",
          description: "Callback function name",
        },
      },
      required: ["agent_id", "topics"],
    },
  },

  // ============================================================================
  // SAFETY & MONITORING
  // ============================================================================

  {
    name: "nwo_check_safety",
    description:
      "Real-time safety validation. Force/torque limits, human proximity, collision prediction.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        planned_action: {
          type: "object",
          description: "Planned action to validate",
        },
        environment_scan: {
          type: "object",
          description: "Current environment state",
        },
      },
      required: ["agent_id", "planned_action"],
    },
  },

  {
    name: "nwo_emergency_stop",
    description: "Trigger emergency stop on robot. Immediate halt with guaranteed <10ms response.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        reason: {
          type: "string",
          description: "Reason for emergency stop",
        },
      },
      required: ["agent_id"],
    },
  },

  {
    name: "nwo_enable_safety_monitoring",
    description:
      "Enable continuous real-time safety monitoring with dynamic speed adjustment.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        safety_zones: {
          type: "object",
          description: "Danger and warning zones",
        },
        response_time_ms: {
          type: "number",
          description: "Required response time",
        },
      },
      required: ["agent_id"],
    },
  },

  // ============================================================================
  // EMBODIMENT REGISTRY & CALIBRATION
  // ============================================================================

  {
    name: "nwo_register_embodiment",
    description:
      "Register robot embodiment with standardized URDF/MJCF/SDF formats. Supports 50+ platforms.",
    input_schema: {
      type: "object" as const,
      properties: {
        robot_name: {
          type: "string",
          description: "Robot name",
        },
        format: {
          type: "string",
          enum: ["urdf", "mjcf", "sdf"],
          description: "Robot description format",
        },
        file_url: {
          type: "string",
          description: "URL to robot file or base64 content",
        },
        specs: {
          type: "object",
          description: "Robot specifications (DOF, end effector, sensors)",
        },
      },
      required: ["robot_name", "format"],
    },
  },

  {
    name: "nwo_auto_calibrate",
    description:
      "Automated calibration of joint offsets, camera extrinsics, and sensor bias. <5min calibration time.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        calibration_type: {
          type: "string",
          enum: ["joint_offset", "camera_extrinsic", "force_torque", "kinematic"],
          description: "Type of calibration",
        },
        method: {
          type: "string",
          enum: ["automatic", "manual", "interactive"],
          description: "Calibration method",
        },
      },
      required: ["agent_id", "calibration_type"],
    },
  },

  {
    name: "nwo_get_embodiment_info",
    description: "Get embodiment specifications with normalized output formats.",
    input_schema: {
      type: "object" as const,
      properties: {
        robot_type: {
          type: "string",
          description: "Robot type identifier",
        },
        output_format: {
          type: "string",
          enum: ["normalized", "raw_joints", "denormalized", "sdk_ready"],
          description: "Output format",
        },
      },
      required: ["robot_type"],
    },
  },

  // ============================================================================
  // AUTONOMOUS AGENT FEATURES
  // ============================================================================

  {
    name: "nwo_agent_self_register",
    description:
      "AI agents can self-register with wallet address. No human approval needed.",
    input_schema: {
      type: "object" as const,
      properties: {
        wallet_address: {
          type: "string",
          description: "Ethereum wallet address",
        },
        agent_name: {
          type: "string",
          description: "Name for the agent",
        },
        agent_type: {
          type: "string",
          description: "Type of agent",
        },
        capabilities: {
          type: "array",
          items: { type: "string" },
          description: "Agent capabilities",
        },
      },
      required: ["wallet_address"],
    },
  },

  {
    name: "nwo_agent_pay",
    description:
      "Autonomous payment with ETH for API tier upgrade. Enable agents to pay for their own resources.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Agent identifier",
        },
        tier: {
          type: "string",
          enum: ["free", "prototype", "production"],
          description: "Tier to upgrade to",
        },
        billing_period: {
          type: "string",
          enum: ["monthly", "yearly"],
          description: "Billing period",
        },
        tx_hash: {
          type: "string",
          description: "Ethereum transaction hash",
        },
      },
      required: ["agent_id", "tier"],
    },
  },

  {
    name: "nwo_agent_check_balance",
    description: "Check agent quota, usage, and subscription status.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Agent identifier",
        },
      },
      required: ["agent_id"],
    },
  },

  {
    name: "nwo_agent_discovery",
    description:
      "Agent discovery for autonomous workflows. Get system capabilities and available endpoints.",
    input_schema: {
      type: "object" as const,
      properties: {
        discovery_type: {
          type: "string",
          enum: ["capabilities", "robots", "features", "endpoints"],
          description: "What to discover",
        },
      },
    },
  },

  // ============================================================================
  // DATASET & EXPORT
  // ============================================================================

  {
    name: "nwo_export_dataset",
    description:
      "Export API interactions as training datasets. JSON format ready for Hugging Face sharing.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        start_date: {
          type: "string",
          description: "Start date (ISO 8601)",
        },
        end_date: {
          type: "string",
          description: "End date (ISO 8601)",
        },
        format: {
          type: "string",
          enum: ["json", "csv", "parquet"],
          description: "Export format",
        },
      },
      required: ["agent_id"],
    },
  },

  {
    name: "nwo_get_unitree_datasets",
    description:
      "Access 1.54M+ human demonstrations for Unitree G1. LIBERO, CALVIN, and household task datasets.",
    input_schema: {
      type: "object" as const,
      properties: {
        task: {
          type: "string",
          enum: [
            "pick_up_pillow",
            "collect_clothes",
            "washing_machine",
            "dishwasher",
            "make_bed",
          ],
          description: "Task dataset",
        },
        difficulty: {
          type: "string",
          enum: ["beginner", "intermediate", "advanced"],
          description: "Difficulty level",
        },
      },
    },
  },

  // ============================================================================
  // WORKSPACE & DEMO
  // ============================================================================

  {
    name: "nwo_launch_playground",
    description:
      "Launch interactive simulation playground to test agents before real deployment.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_type: {
          type: "string",
          enum: ["pick_place", "navigation", "inspection", "custom"],
          description: "Type of agent",
        },
        environment: {
          type: "string",
          enum: ["kitchen", "warehouse", "office", "factory"],
          description: "Simulation environment",
        },
        task_instruction: {
          type: "string",
          description: "Task to simulate",
        },
      },
      required: ["agent_type"],
    },
  },

  {
    name: "nwo_test_dry_run",
    description:
      "Validate task before execution. Get confidence estimates, duration predictions, and safety warnings.",
    input_schema: {
      type: "object" as const,
      properties: {
        instruction: {
          type: "string",
          description: "Task instruction",
        },
        agent_id: {
          type: "string",
          description: "Robot/agent identifier",
        },
        execution_mode: {
          type: "string",
          enum: ["mock", "simulated"],
          description: "Execution mode",
        },
      },
      required: ["instruction"],
    },
  },
];

// Main tool handler
async function processToolCall(
  toolName: string,
  toolInput: Record<string, unknown>
): Promise<string> {
  try {
    // Construct API endpoint based on tool name
    let endpoint = "";
    let method = "POST";
    let body = toolInput;

    // Map tool names to API endpoints
    switch (toolName) {
      // SLAM & Localization
      case "nwo_initialize_slam":
        endpoint = `${NWO_API_BASE}/api-slam.php?action=initialize`;
        break;
      case "nwo_localize":
        endpoint = `${NWO_API_BASE}/api-slam.php?action=localize`;
        break;

      // RL Training
      case "nwo_create_rl_env":
        endpoint = `${NWO_API_BASE}/api-rl.php?action=create_env`;
        break;
      case "nwo_train_policy":
        endpoint = `${NWO_API_BASE}/api-rl.php?action=train_policy`;
        break;

      // Vision & Grounding
      case "nwo_detect_objects_grounding":
        endpoint = `${NWO_API_BASE}/api-vision.php?action=grounding`;
        break;

      // Novel Sensors
      case "nwo_query_thermal":
        endpoint = `${NWO_API_BASE}/api-sensors.php?action=thermal`;
        break;
      case "nwo_query_mmwave":
        endpoint = `${NWO_API_BASE}/api-sensors.php?action=mmwave`;
        break;
      case "nwo_query_gas":
        endpoint = `${NWO_API_BASE}/api-sensors.php?action=gas`;
        break;
      case "nwo_query_acoustic":
        endpoint = `${NWO_API_BASE}/api-sensors.php?action=acoustic`;
        break;
      case "nwo_query_magnetic":
        endpoint = `${NWO_API_BASE}/api-sensors.php?action=magnetic`;
        break;

      // Tactile & Material
      case "nwo_read_tactile":
        endpoint = `${NWO_API_BASE}/api-orca.php?action=read_tactile`;
        break;
      case "nwo_identify_material":
        endpoint = `${NWO_API_BASE}/api-perception.php?action=identify_material`;
        break;

      // Motion Planning & Behavior Trees
      case "nwo_plan_motion":
        endpoint = `${NWO_API_BASE}/api-planning.php?action=plan_motion`;
        break;
      case "nwo_execute_behavior_tree":
        endpoint = `${NWO_API_BASE}/api-tasks.php?action=execute_behavior_tree`;
        break;

      // Standard Inference
      case "nwo_inference":
        endpoint = `${NWO_API_BASE}/api-robotics.php?action=inference`;
        break;
      case "nwo_inference_with_router":
        endpoint = `${NWO_API_BASE}/api-robotics.php?action=inference`;
        body = { ...toolInput, use_model_router: true };
        break;
      case "nwo_edge_inference":
        endpoint = `${NWO_EDGE_API}/inference`;
        break;

      // Models
      case "nwo_list_models":
        endpoint = `${NWO_API_BASE}/api-robotics.php?action=list_models`;
        method = "GET";
        break;
      case "nwo_get_model_info":
        endpoint = `${NWO_API_BASE}/api-robotics.php?action=get_model_info&model_id=${toolInput.model_id}`;
        method = "GET";
        break;

      // Robot Control
      case "nwo_query_robot_state":
        endpoint = `${NWO_API_BASE}/api-robotics.php?action=query_state`;
        break;
      case "nwo_execute_actions":
        endpoint = `${NWO_API_BASE}/api-robotics.php?action=execute`;
        break;
      case "nwo_sensor_fusion":
        endpoint = `${NWO_API_BASE}/api-robotics.php?action=sensor_fusion`;
        break;

      // Task Planning
      case "nwo_task_planner":
        endpoint = `${NWO_API_BASE}/api-robotics.php?action=task_planner`;
        break;
      case "nwo_execute_subtask":
        endpoint = `${NWO_API_BASE}/api-robotics.php?action=execute_subtask`;
        break;
      case "nwo_get_learning_recommendations":
        endpoint = `${NWO_API_BASE}/api-robotics.php?action=learning&subaction=recommend`;
        break;
      case "nwo_log_task_execution":
        endpoint = `${NWO_API_BASE}/api-robotics.php?action=learning&subaction=log`;
        break;

      // Agent Management
      case "nwo_register_agent":
        endpoint = `${NWO_API_BASE}/api-robotics.php?action=register_agent`;
        break;
      case "nwo_update_agent":
        endpoint = `${NWO_API_BASE}/api-robotics.php?action=update_agent`;
        break;
      case "nwo_get_agent_info":
        endpoint = `${NWO_API_BASE}/api-robotics.php?action=get_agent`;
        break;

      // Voice & Gesture
      case "nwo_detect_gesture":
        endpoint = `${NWO_API_BASE}/api-gesture.php?action=detect_gesture`;
        break;
      case "nwo_process_voice_command":
        endpoint = `${NWO_API_BASE}/api-voice.php?action=process_voice`;
        break;

      // Simulation
      case "nwo_simulate_trajectory":
        endpoint = `${NWO_API_BASE}/api-simulation.php?action=simulate_trajectory`;
        break;
      case "nwo_check_collision":
        endpoint = `${NWO_API_BASE}/api-simulation.php?action=check_collision`;
        break;
      case "nwo_cosmos_generate_scene":
        endpoint = `${NWO_API_BASE}/api-cosmos.php?action=generate_scene`;
        break;

      // ROS2
      case "nwo_connect_ros2_robot":
        endpoint = `${NWO_API_BASE}/api-ros2-bridge.php?action=register_robot`;
        break;
      case "nwo_send_ros2_action":
        endpoint = `${NWO_ROS2_BRIDGE}/api/v1/action`;
        break;
      case "nwo_get_ros2_state":
        endpoint = `${NWO_ROS2_BRIDGE}/api/v1/robots/${toolInput.robot_id}/status`;
        method = "GET";
        break;

      // MQTT
      case "nwo_mqtt_publish":
        endpoint = `${NWO_API_BASE}/api-mqtt.php?action=publish`;
        break;
      case "nwo_mqtt_subscribe":
        endpoint = `${NWO_API_BASE}/api-mqtt.php?action=subscribe`;
        break;

      // Safety
      case "nwo_check_safety":
        endpoint = `${NWO_API_BASE}/api-safety.php?action=check_action_safety`;
        break;
      case "nwo_emergency_stop":
        endpoint = `${NWO_API_BASE}/api-safety.php?action=emergency_stop`;
        break;
      case "nwo_enable_safety_monitoring":
        endpoint = `${NWO_API_BASE}/api-safety.php?action=enable_realtime_safety`;
        break;

      // Embodiment
      case "nwo_register_embodiment":
        endpoint = `${NWO_API_BASE}/api-embodiment.php?action=register`;
        break;
      case "nwo_auto_calibrate":
        endpoint = `${NWO_API_BASE}/api-calibration.php?action=run_calibration`;
        break;
      case "nwo_get_embodiment_info":
        endpoint = `${NWO_API_BASE}/api-embodiment.php?action=detail`;
        break;

      // Autonomous Agents
      case "nwo_agent_self_register":
        endpoint = `${NWO_API_BASE}/api-agent-register.php`;
        break;
      case "nwo_agent_pay":
        endpoint = `${NWO_API_BASE}/api-agent-pay.php`;
        break;
      case "nwo_agent_check_balance":
        endpoint = `${NWO_API_BASE}/api-agent-balance.php`;
        method = "GET";
        break;
      case "nwo_agent_discovery":
        endpoint = `${NWO_API_BASE}/api-agent-discovery.php?action=capabilities`;
        method = "GET";
        break;

      // Dataset
      case "nwo_export_dataset":
        endpoint = `${NWO_API_BASE}/api-robotics.php?action=export_dataset`;
        break;
      case "nwo_get_unitree_datasets":
        endpoint = `${NWO_API_BASE}/api-unitree-datasets.php?action=list`;
        method = "GET";
        break;

      // Demo
      case "nwo_launch_playground":
        endpoint = `${NWO_API_BASE}/api-playground.php?action=launch`;
        break;
      case "nwo_test_dry_run":
        endpoint = `${NWO_API_BASE}/api-agent-discovery.php?action=dry-run`;
        break;

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }

    // Make the API call
    const response = await fetch(endpoint, {
      method: method,
      headers: {
        "X-API-Key": NWO_API_KEY,
        "Content-Type": "application/json",
      },
      ...(method === "POST" && { body: JSON.stringify(body) }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `API error ${response.status}: ${errorData.substring(0, 200)}`
      );
    }

    const data = await response.json();
    return JSON.stringify(data);
  } catch (error) {
    return JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Process tool use in message
async function handleToolUse(
  toolUseBlock: Anthropic.ToolUseBlock
): Promise<string> {
  const toolName = toolUseBlock.name;
  const toolInput = toolUseBlock.input as Record<string, unknown>;

  console.log(`\n📋 Tool: ${toolName}`);
  console.log(`📥 Input: ${JSON.stringify(toolInput, null, 2)}`);

  const result = await processToolCall(toolName, toolInput);
  console.log(`📤 Result: ${result.substring(0, 500)}...`);

  return result;
}

// Main MCP server loop
async function main() {
  console.log("🤖 NWO Robotics MCP Server Starting...");
  console.log(`📍 API Base: ${NWO_API_BASE}`);
  console.log(`📍 Edge API: ${NWO_EDGE_API}`);
  console.log(`📍 ROS2 Bridge: ${NWO_ROS2_BRIDGE}`);
  console.log(`📍 MQTT Broker: ${MQTT_BROKER}:${MQTT_PORT}`);
  console.log(`✅ Tools Loaded: ${tools.length}`);
  console.log("═══════════════════════════════════════════════════════════\n");

  const conversationHistory: Anthropic.MessageParam[] = [];

  // Example interaction
  const userMessage =
    "I want to initialize SLAM mapping on robot robot_001 and then localize it in the map. What should I do?";

  conversationHistory.push({
    role: "user",
    content: userMessage,
  });

  console.log(`👤 User: ${userMessage}\n`);

  // First API call with tools
  let response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    tools: tools,
    messages: conversationHistory,
  });

  console.log(`🤖 Assistant (Response ${response.id}):`);

  // Process response
  let hasToolUse = true;
  while (hasToolUse) {
    hasToolUse = false;

    for (const block of response.content) {
      if (block.type === "text") {
        console.log(block.text);
      } else if (block.type === "tool_use") {
        hasToolUse = true;
        const toolResult = await handleToolUse(block);

        // Add assistant response and tool result to history
        conversationHistory.push({
          role: "assistant",
          content: response.content,
        });

        conversationHistory.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: block.id,
              content: toolResult,
            },
          ],
        });

        // Continue conversation with tool results
        response = await client.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 4096,
          tools: tools,
          messages: conversationHistory,
        });

        console.log(`\n🤖 Assistant (continued):`);
      }
    }
  }

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log(
    "✅ MCP Server conversation complete. Ready for further interactions."
  );
}

// Run the server
main().catch(console.error);
