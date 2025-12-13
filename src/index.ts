#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import axios, { AxiosInstance, AxiosError } from "axios";

// Configuration from environment variables
const API_BASE_URL = process.env.FEATUREFLOW_API_URL || "http://localhost:8080/api";
const API_TOKEN = process.env.FEATUREFLOW_API_TOKEN || "";

// Create axios instance with authentication
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Define all available tools
const tools: Tool[] = [
  // ============ PROJECTS ============
  {
    name: "list_projects",
    description:
      "List all projects in the organization. Optionally filter by a search query that matches project name or key.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Optional search query to filter projects by name or key",
        },
      },
    },
  },
  {
    name: "get_project",
    description: "Get detailed information about a specific project by its ID or key.",
    inputSchema: {
      type: "object" as const,
      properties: {
        idOrKey: {
          type: "string",
          description: "The project ID or key",
        },
      },
      required: ["idOrKey"],
    },
  },
  {
    name: "create_project",
    description: "Create a new project in the organization.",
    inputSchema: {
      type: "object" as const,
      properties: {
        key: {
          type: "string",
          description: "Unique project key (lowercase, no spaces, use hyphens)",
        },
        name: {
          type: "string",
          description: "Display name for the project",
        },
      },
      required: ["key", "name"],
    },
  },
  {
    name: "update_project",
    description: "Update an existing project's name.",
    inputSchema: {
      type: "object" as const,
      properties: {
        idOrKey: {
          type: "string",
          description: "The project ID or key to update",
        },
        name: {
          type: "string",
          description: "New display name for the project",
        },
      },
      required: ["idOrKey", "name"],
    },
  },
  {
    name: "delete_project",
    description: "Delete a project. This will also delete all features and environments in the project.",
    inputSchema: {
      type: "object" as const,
      properties: {
        idOrKey: {
          type: "string",
          description: "The project ID or key to delete",
        },
      },
      required: ["idOrKey"],
    },
  },

  // ============ FEATURES ============
  {
    name: "list_features",
    description:
      "List all features. Can filter by project key, search query, or predefined filters (maintaining, bookmarked, recent).",
    inputSchema: {
      type: "object" as const,
      properties: {
        projectKey: {
          type: "string",
          description: "Project key to filter features",
        },
        query: {
          type: "string",
          description: "Search query to match feature key or name",
        },
        filter: {
          type: "string",
          enum: ["maintaining", "bookmarked", "recent"],
          description: "Predefined filter type",
        },
        archived: {
          type: "boolean",
          description: "Include archived features (default: false)",
        },
      },
    },
  },
  {
    name: "get_feature",
    description:
      "Get detailed information about a specific feature by ID or unified key (projectKey:featureKey).",
    inputSchema: {
      type: "object" as const,
      properties: {
        idOrUnifiedKey: {
          type: "string",
          description: "Feature ID or unified key (e.g., 'myproject:my-feature')",
        },
      },
      required: ["idOrUnifiedKey"],
    },
  },
  {
    name: "create_feature",
    description: "Create a new feature flag in a project.",
    inputSchema: {
      type: "object" as const,
      properties: {
        projectKey: {
          type: "string",
          description: "The project key where the feature will be created",
        },
        key: {
          type: "string",
          description: "Unique feature key within the project (lowercase, no spaces)",
        },
        name: {
          type: "string",
          description: "Display name for the feature",
        },
        description: {
          type: "string",
          description: "Optional description of the feature",
        },
      },
      required: ["projectKey", "key", "name"],
    },
  },
  {
    name: "update_feature",
    description: "Update an existing feature's properties like name, description, or variants.",
    inputSchema: {
      type: "object" as const,
      properties: {
        idOrUnifiedKey: {
          type: "string",
          description: "Feature ID or unified key",
        },
        name: {
          type: "string",
          description: "New display name for the feature",
        },
        description: {
          type: "string",
          description: "New description for the feature",
        },
      },
      required: ["idOrUnifiedKey"],
    },
  },
  {
    name: "clone_feature",
    description: "Clone an existing feature with a new key and name.",
    inputSchema: {
      type: "object" as const,
      properties: {
        idOrUnifiedKey: {
          type: "string",
          description: "Feature ID or unified key of the source feature to clone",
        },
        newKey: {
          type: "string",
          description: "Key for the cloned feature",
        },
        name: {
          type: "string",
          description: "Name for the cloned feature",
        },
      },
      required: ["idOrUnifiedKey", "newKey", "name"],
    },
  },
  {
    name: "archive_feature",
    description: "Archive or unarchive a feature flag.",
    inputSchema: {
      type: "object" as const,
      properties: {
        idOrUnifiedKey: {
          type: "string",
          description: "Feature ID or unified key",
        },
        archived: {
          type: "boolean",
          description: "Set to true to archive, false to unarchive",
        },
      },
      required: ["idOrUnifiedKey", "archived"],
    },
  },
  {
    name: "delete_feature",
    description: "Delete a feature flag. Requires production editor or admin permissions.",
    inputSchema: {
      type: "object" as const,
      properties: {
        idOrUnifiedKey: {
          type: "string",
          description: "Feature ID or unified key to delete",
        },
      },
      required: ["idOrUnifiedKey"],
    },
  },

  // ============ FEATURE CONTROLS ============
  {
    name: "get_feature_control",
    description:
      "Get the feature control configuration for a specific feature and environment. Shows enabled state, rules, and variant assignments.",
    inputSchema: {
      type: "object" as const,
      properties: {
        idOrUnifiedKey: {
          type: "string",
          description: "Feature ID or unified key",
        },
        environmentKey: {
          type: "string",
          description: "Environment key (e.g., 'development', 'production')",
        },
      },
      required: ["idOrUnifiedKey", "environmentKey"],
    },
  },
  {
    name: "update_feature_control",
    description:
      "Update feature control settings for a specific environment. Can enable/disable the feature, change the off variant, and modify rules.",
    inputSchema: {
      type: "object" as const,
      properties: {
        idOrUnifiedKey: {
          type: "string",
          description: "Feature ID or unified key",
        },
        environmentKey: {
          type: "string",
          description: "Environment key",
        },
        enabled: {
          type: "boolean",
          description: "Whether the feature is enabled in this environment",
        },
        offVariantKey: {
          type: "string",
          description: "The variant to serve when the feature is disabled",
        },
      },
      required: ["idOrUnifiedKey", "environmentKey"],
    },
  },

  // ============ ENVIRONMENTS ============
  {
    name: "list_environments",
    description: "List all environments for a project or the entire organization.",
    inputSchema: {
      type: "object" as const,
      properties: {
        projectKey: {
          type: "string",
          description: "Optional project key to filter environments",
        },
      },
    },
  },
  {
    name: "get_environment",
    description:
      "Get detailed information about a specific environment by ID or unified key (projectKey:environmentKey).",
    inputSchema: {
      type: "object" as const,
      properties: {
        idOrUnifiedKey: {
          type: "string",
          description: "Environment ID or unified key (e.g., 'myproject:production')",
        },
      },
      required: ["idOrUnifiedKey"],
    },
  },
  {
    name: "create_environment",
    description: "Create a new environment for a project. Optionally clone settings from an existing environment.",
    inputSchema: {
      type: "object" as const,
      properties: {
        projectKey: {
          type: "string",
          description: "The project key where the environment will be created",
        },
        key: {
          type: "string",
          description: "Unique environment key within the project",
        },
        name: {
          type: "string",
          description: "Display name for the environment",
        },
        color: {
          type: "string",
          description: "Color for the environment (hex code)",
        },
        production: {
          type: "boolean",
          description: "Whether this is a production environment",
        },
        cloneEnvironmentKey: {
          type: "string",
          description: "Optional environment key to clone settings from",
        },
      },
      required: ["projectKey", "key", "name"],
    },
  },
  {
    name: "update_environment",
    description: "Update an existing environment's properties.",
    inputSchema: {
      type: "object" as const,
      properties: {
        idOrUnifiedKey: {
          type: "string",
          description: "Environment ID or unified key",
        },
        name: {
          type: "string",
          description: "New display name",
        },
        color: {
          type: "string",
          description: "New color (hex code)",
        },
        url: {
          type: "string",
          description: "Environment URL",
        },
        production: {
          type: "boolean",
          description: "Whether this is a production environment",
        },
      },
      required: ["idOrUnifiedKey"],
    },
  },
  {
    name: "delete_environment",
    description: "Delete an environment. Cannot delete the last environment in a project.",
    inputSchema: {
      type: "object" as const,
      properties: {
        idOrUnifiedKey: {
          type: "string",
          description: "Environment ID or unified key to delete",
        },
      },
      required: ["idOrUnifiedKey"],
    },
  },

  // ============ TARGETS ============
  {
    name: "list_targets",
    description:
      "Get all targets (user attributes) for a project. Targets are used in targeting rules for A/B testing.",
    inputSchema: {
      type: "object" as const,
      properties: {
        projectKey: {
          type: "string",
          description: "Project key",
        },
      },
      required: ["projectKey"],
    },
  },
  {
    name: "get_target",
    description: "Get a specific target by its key.",
    inputSchema: {
      type: "object" as const,
      properties: {
        projectKey: {
          type: "string",
          description: "Project key",
        },
        targetKey: {
          type: "string",
          description: "Target key to look up",
        },
      },
      required: ["projectKey", "targetKey"],
    },
  },

  // ============ API KEYS ============
  {
    name: "list_api_keys",
    description: "List API keys for a specific environment.",
    inputSchema: {
      type: "object" as const,
      properties: {
        environmentKey: {
          type: "string",
          description: "Environment unified key (projectKey:environmentKey format)",
        },
        type: {
          type: "string",
          enum: ["server_environment", "client_environment"],
          description: "Optional type filter for API keys",
        },
      },
      required: ["environmentKey"],
    },
  },
];

// Format error messages from API responses
function formatError(error: unknown): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data;

    if (data?.message) {
      return `Error (${status}): ${data.message}`;
    }
    if (data?.title) {
      return `Error (${status}): ${data.title}`;
    }
    if (error.message) {
      return `Error: ${error.message}`;
    }
  }
  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }
  return `Error: ${String(error)}`;
}

// Handle tool invocations
async function handleTool(name: string, args: Record<string, unknown>): Promise<string> {
  try {
    switch (name) {
      // ============ PROJECTS ============
      case "list_projects": {
        const params: Record<string, unknown> = {};
        if (args.query) params.query = args.query;
        const response = await api.get("/v1/projects", { params });
        return JSON.stringify(response.data, null, 2);
      }

      case "get_project": {
        const response = await api.get(`/v1/projects/${args.idOrKey}`);
        return JSON.stringify(response.data, null, 2);
      }

      case "create_project": {
        const response = await api.post("/v1/projects", {
          key: args.key,
          name: args.name,
        });
        return JSON.stringify(response.data, null, 2);
      }

      case "update_project": {
        const response = await api.put(`/v1/projects/${args.idOrKey}`, {
          name: args.name,
        });
        return JSON.stringify(response.data, null, 2);
      }

      case "delete_project": {
        await api.delete(`/v1/projects/${args.idOrKey}`);
        return `Project '${args.idOrKey}' deleted successfully.`;
      }

      // ============ FEATURES ============
      case "list_features": {
        const params: Record<string, unknown> = {};
        if (args.projectKey) params.projectKey = args.projectKey;
        if (args.query) params.query = args.query;
        if (args.filter) params.filter = args.filter;
        if (args.archived !== undefined) params.archived = args.archived;
        const response = await api.get("/v1/features", { params });
        return JSON.stringify(response.data, null, 2);
      }

      case "get_feature": {
        const response = await api.get(`/v1/features/${args.idOrUnifiedKey}`);
        return JSON.stringify(response.data, null, 2);
      }

      case "create_feature": {
        const response = await api.post("/v1/features", {
          projectKey: args.projectKey,
          key: args.key,
          name: args.name,
          description: args.description,
        });
        return JSON.stringify(response.data, null, 2);
      }

      case "update_feature": {
        const body: Record<string, unknown> = {};
        if (args.name) body.name = args.name;
        if (args.description !== undefined) body.description = args.description;
        const response = await api.put(`/v1/features/${args.idOrUnifiedKey}`, body);
        return JSON.stringify(response.data, null, 2);
      }

      case "clone_feature": {
        const response = await api.post(`/v1/features/${args.idOrUnifiedKey}/clone`, {
          newKey: args.newKey,
          name: args.name,
        });
        return JSON.stringify(response.data, null, 2);
      }

      case "archive_feature": {
        const response = await api.put(
          `/v1/features/${args.idOrUnifiedKey}/archived/${args.archived}`
        );
        return JSON.stringify(response.data, null, 2);
      }

      case "delete_feature": {
        await api.delete(`/v1/features/${args.idOrUnifiedKey}`);
        return `Feature '${args.idOrUnifiedKey}' deleted successfully.`;
      }

      // ============ FEATURE CONTROLS ============
      case "get_feature_control": {
        const response = await api.get(
          `/v1/features/${args.idOrUnifiedKey}/controls/${args.environmentKey}`
        );
        return JSON.stringify(response.data, null, 2);
      }

      case "update_feature_control": {
        const body: Record<string, unknown> = {};
        if (args.enabled !== undefined) body.enabled = args.enabled;
        if (args.offVariantKey) body.offVariantKey = args.offVariantKey;
        const response = await api.put(
          `/v1/features/${args.idOrUnifiedKey}/controls/${args.environmentKey}`,
          body
        );
        return JSON.stringify(response.data, null, 2);
      }

      // ============ ENVIRONMENTS ============
      case "list_environments": {
        const params: Record<string, unknown> = {};
        if (args.projectKey) params.projectKey = args.projectKey;
        const response = await api.get("/v1/environments", { params });
        return JSON.stringify(response.data, null, 2);
      }

      case "get_environment": {
        const response = await api.get(`/v1/environments/${args.idOrUnifiedKey}`);
        return JSON.stringify(response.data, null, 2);
      }

      case "create_environment": {
        const response = await api.post("/v1/environments", {
          projectKey: args.projectKey,
          key: args.key,
          name: args.name,
          color: args.color,
          production: args.production,
          cloneEnvironmentKey: args.cloneEnvironmentKey,
        });
        return JSON.stringify(response.data, null, 2);
      }

      case "update_environment": {
        const body: Record<string, unknown> = {};
        if (args.name) body.name = args.name;
        if (args.color) body.color = args.color;
        if (args.url) body.url = args.url;
        if (args.production !== undefined) body.production = args.production;
        const response = await api.put(`/v1/environments/${args.idOrUnifiedKey}`, body);
        return JSON.stringify(response.data, null, 2);
      }

      case "delete_environment": {
        await api.delete(`/v1/environments/${args.idOrUnifiedKey}`);
        return `Environment '${args.idOrUnifiedKey}' deleted successfully.`;
      }

      // ============ TARGETS ============
      case "list_targets": {
        const response = await api.get("/v1/targets", {
          params: { projectKey: args.projectKey },
        });
        return JSON.stringify(response.data, null, 2);
      }

      case "get_target": {
        const response = await api.get(`/v1/targets/${args.targetKey}`, {
          params: { projectKey: args.projectKey },
        });
        return JSON.stringify(response.data, null, 2);
      }

      // ============ API KEYS ============
      case "list_api_keys": {
        const params: Record<string, unknown> = {
          environmentKey: args.environmentKey,
        };
        if (args.type) params.type = args.type;
        const response = await api.get("/v1/api-keys", { params });
        return JSON.stringify(response.data, null, 2);
      }

      default:
        return `Unknown tool: ${name}`;
    }
  } catch (error) {
    return formatError(error);
  }
}

// Create and configure the MCP server
const server = new Server(
  {
    name: "featureflow-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register the list tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Register the call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const result = await handleTool(name, (args as Record<string, unknown>) || {});
  return {
    content: [
      {
        type: "text",
        text: result,
      },
    ],
  };
});

// Main entry point
async function main() {
  // Validate configuration
  if (!API_TOKEN) {
    console.error("Warning: FEATUREFLOW_API_TOKEN is not set. API calls will likely fail.");
  }

  console.error(`Featureflow MCP Server starting...`);
  console.error(`API URL: ${API_BASE_URL}`);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Featureflow MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

