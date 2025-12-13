# Featureflow MCP Server

An MCP (Model Context Protocol) server for the Featureflow feature flag management API. This allows AI assistants like Claude to interact with your Featureflow instance to manage feature flags, projects, environments, and more.

## Features

- **Projects**: List, get, create, update, and delete projects
- **Features**: List, get, create, update, clone, archive, and delete feature flags
- **Feature Controls**: Get and update feature controls per environment
- **Environments**: List, get, create, update, and delete environments
- **Targets**: List and manage targeting attributes

## Installation

```bash
npm install
npm run build
```

## Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit the `.env` file with your Featureflow API credentials:

```env
FEATUREFLOW_API_URL=http://localhost:8080/api
FEATUREFLOW_API_TOKEN=your-jwt-token-here
```

### Getting an API Token

1. Log into your Featureflow instance
2. Navigate to your account settings
3. Generate a JWT token or use an existing API key

## Usage with Cursor

Add the MCP server to your Cursor settings. Create or edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "featureflow": {
      "command": "node",
      "args": ["/Users/oliver/dev/src/featureflow/featureflow-mcp/dist/index.js"],
      "env": {
        "FEATUREFLOW_API_URL": "http://localhost:8080/api",
        "FEATUREFLOW_API_TOKEN": "your-jwt-token-here"
      }
    }
  }
}
```

Then restart Cursor to load the MCP server.

## Available Tools

### Projects

| Tool | Description |
|------|-------------|
| `list_projects` | List all projects, optionally filtered by query |
| `get_project` | Get a specific project by ID or key |
| `create_project` | Create a new project |
| `update_project` | Update an existing project |
| `delete_project` | Delete a project |

### Features

| Tool | Description |
|------|-------------|
| `list_features` | List features with optional filters (project, query, archived) |
| `get_feature` | Get a specific feature by ID or unified key |
| `create_feature` | Create a new feature flag |
| `update_feature` | Update an existing feature |
| `clone_feature` | Clone a feature with a new key |
| `archive_feature` | Archive or unarchive a feature |
| `delete_feature` | Delete a feature |

### Feature Controls

| Tool | Description |
|------|-------------|
| `get_feature_control` | Get feature control settings for an environment |
| `update_feature_control` | Update feature control settings (enable/disable, rules, etc.) |

### Environments

| Tool | Description |
|------|-------------|
| `list_environments` | List environments for a project |
| `get_environment` | Get a specific environment |
| `create_environment` | Create a new environment |
| `update_environment` | Update an existing environment |
| `delete_environment` | Delete an environment |

### Targets

| Tool | Description |
|------|-------------|
| `list_targets` | List all targets for a project |
| `get_target` | Get a specific target by key |

## Development

```bash
# Watch mode for development
npm run dev

# Build
npm run build

# Run
npm start
```

## License

MIT

