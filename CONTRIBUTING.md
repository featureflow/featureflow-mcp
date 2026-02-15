# Contributing to Featureflow MCP Server

Thank you for your interest in contributing to the Featureflow MCP Server!

## Development Setup

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

## Development Workflow

### Building

```bash
npm run build
```

This compiles TypeScript and sets executable permissions on the output.

### Watch Mode

```bash
npm run dev
```

Automatically recompiles on file changes (note: you'll need to restart the MCP server to pick up changes).

### Testing Locally in Cursor

To test your local changes in Cursor, update `~/.cursor/mcp.json` to point to your local build:

```json
{
  "mcpServers": {
    "featureflow": {
      "command": "node",
      "args": ["/path/to/featureflow-mcp/dist/index.js"],
      "env": {
        "PATH": "/path/to/node/bin:/usr/bin:/bin",
        "FEATUREFLOW_API_TOKEN": "api-your-token-here"
      }
    }
  }
}
```

Then restart Cursor or run `Cmd+Shift+P` → "MCP: Restart Servers".

**Note:** If you're using nvm, you may need to include the full PATH to your node installation.

## Project Structure

```
featureflow-mcp/
├── src/
│   └── index.ts      # Main MCP server implementation
├── dist/             # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── README.md
```

## Adding New Tools

1. Add the tool definition to the `tools` array in `src/index.ts`
2. Add the handler case in the `handleTool` function
3. Update the README.md with documentation for the new tool
4. Build and test locally before submitting a PR

## Publishing to npm

### Prerequisites

- You must be logged into npm with publish access to the `featureflow-mcp` package
- Run `npm login` if not already authenticated

### Publishing Steps

1. **Update the version** in `package.json`:
   ```json
   "version": "1.0.3"
   ```
   Follow [semantic versioning](https://semver.org/):
   - **PATCH** (1.0.x): Bug fixes, minor changes
   - **MINOR** (1.x.0): New features, backward compatible
   - **MAJOR** (x.0.0): Breaking changes

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Publish to npm**:
   ```bash
   npm publish
   ```

4. **Clear the npx cache** (for testing):
   ```bash
   rm -rf ~/.npm/_npx/*featureflow*
   ```

5. **Restart Cursor** or run "MCP: Restart Servers" to pick up the new version.

### Verifying the Published Package

After publishing, verify the new version is available:

```bash
npm view featureflow-mcp version
```

Test with a fresh npx install:

```bash
npx -y featureflow-mcp --help
```

## Code Style

- Use TypeScript for all source code
- Follow existing patterns for tool definitions and handlers
- Add appropriate error handling using the `formatError` helper

## Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Build and test locally
5. Commit your changes (`git commit -am 'Add my feature'`)
6. Push to your fork (`git push origin feature/my-feature`)
7. Open a Pull Request

## Reporting Issues

Please use the [GitHub Issues](https://github.com/featureflow/featureflow-mcp/issues) page to report bugs or request features.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
