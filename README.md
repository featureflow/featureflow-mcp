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

### Authentication

The MCP server supports two authentication methods:

#### 1. Personal Access Token (Recommended)

Personal Access Tokens are long-lived API keys that can be created by administrators in the Featureflow UI. They're ideal for:
- MCP servers
- CI/CD pipelines
- Automation scripts

Personal Access Tokens start with `api-` and are automatically detected by the MCP server.

#### 2. JWT Token

You can also use a JWT token obtained from logging into Featureflow. These are short-lived and will need to be refreshed periodically.

### Creating a Personal Access Token

1. Log into your Featureflow instance as an administrator
2. Navigate to **Settings** → **Personal Access Tokens**
3. Click **Create Token**
4. Give it a descriptive name (e.g., "Cursor MCP Server")
5. Optionally set an expiration date
6. Click **Create** and copy the token immediately (it won't be shown again)

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FEATUREFLOW_API_URL` | Base URL for the Featureflow API | `http://localhost:8080/api` |
| `FEATUREFLOW_API_TOKEN` | Personal Access Token or JWT token | (required) |

## Usage with Cursor

Add the MCP server to your Cursor settings. Create or edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "featureflow": {
      "command": "node",
      "args": ["/path/to/featureflow-mcp/dist/index.js"],
      "env": {
        "FEATUREFLOW_API_URL": "http://localhost:8080/api",
        "FEATUREFLOW_API_TOKEN": "api-your-personal-access-token-here"
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

### API Keys

| Tool | Description |
|------|-------------|
| `list_api_keys` | List SDK API keys for an environment |

## Development

```bash
# Watch mode for development
npm run dev

# Build
npm run build

# Run
npm start
```

## API Authentication Details

The MCP server automatically detects the token type based on its prefix:

- **Personal Access Tokens** (`api-*`, `int-*`): Sent via `X-API-Key` header
- **JWT Tokens**: Sent via `Authorization: Bearer` header

Both methods are fully supported by the Featureflow API.

## Troubleshooting

### "Authentication required" errors

Ensure your `FEATUREFLOW_API_TOKEN` is set correctly:
- For Personal Access Tokens, the value should start with `api-`
- For JWT tokens, ensure the token hasn't expired

### "Forbidden" errors

Your token may not have the required permissions. Personal Access Tokens inherit the permissions of the user who created them. Ensure the user has the appropriate role (e.g., ORGANISATION_ADMIN for administrative operations).

## License

MIT
