# Featureflow MCP Server

[![npm version](https://badge.fury.io/js/featureflow-mcp.svg)](https://www.npmjs.com/package/featureflow-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An MCP (Model Context Protocol) server for [Featureflow](https://featureflow.io) feature flag management. This enables AI assistants like Claude to interact with your Featureflow instance to manage feature flags, projects, environments, and more.

## Quick Start

### 1. Create a Personal Access Token

1. Log into [Featureflow](https://app.featureflow.io) as an administrator
2. Navigate to **Administration** → **API Tokens**
3. Click **Create Token** and copy the token (starts with `api-`)

### 2. Configure in Cursor

Add to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "featureflow": {
      "command": "npx",
      "args": ["-y", "featureflow-mcp"],
      "env": {
        "FEATUREFLOW_API_TOKEN": "api-your-token-here"
      }
    }
  }
}
```

### 3. Restart Cursor

Press `Cmd+Shift+P` → "MCP: Restart Servers" or restart Cursor.

That's it! You can now ask Claude to manage your feature flags.

## Configuration

| Environment Variable | Description | Default |
|---------------------|-------------|---------|
| `FEATUREFLOW_API_TOKEN` | Personal Access Token (required) | - |
| `FEATUREFLOW_API_URL` | API base URL (optional) | `https://beta.featureflow.io/api` |

### Self-Hosted Featureflow

If you're running a self-hosted Featureflow instance:

```json
{
  "mcpServers": {
    "featureflow": {
      "command": "npx",
      "args": ["-y", "featureflow-mcp"],
      "env": {
        "FEATUREFLOW_API_URL": "https://your-instance.com/api",
        "FEATUREFLOW_API_TOKEN": "api-your-token-here"
      }
    }
  }
}
```

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
| `list_features` | List features with optional filters |
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
| `update_feature_control` | Enable/disable features, modify rules |

### Environments

| Tool | Description |
|------|-------------|
| `list_environments` | List environments for a project |
| `get_environment` | Get a specific environment |
| `create_environment` | Create a new environment |
| `update_environment` | Update an existing environment |
| `delete_environment` | Delete an environment |

### Targets & API Keys

| Tool | Description |
|------|-------------|
| `list_targets` | List targeting attributes for a project |
| `get_target` | Get a specific target by key |
| `list_api_keys` | List SDK API keys for an environment |

## Example Usage

Once configured, you can ask Claude things like:

- "List all my Featureflow projects"
- "Create a feature called 'new-checkout' in the 'webapp' project"
- "Enable the 'dark-mode' feature in production"
- "What features are currently enabled in staging?"
- "Disable 'beta-feature' in all environments"

## Development

```bash
# Clone the repository
git clone https://github.com/featureflow/featureflow-mcp.git
cd featureflow-mcp

# Install dependencies
npm install

# Build
npm run build

# Run locally
FEATUREFLOW_API_TOKEN=api-xxx npm start
```

## License

MIT - see [LICENSE](LICENSE) for details.

## Links

- [Featureflow](https://featureflow.io) - Feature flag management platform
- [MCP Protocol](https://modelcontextprotocol.io) - Model Context Protocol specification
- [Featureflow Documentation](https://docs.featureflow.io) - API documentation
