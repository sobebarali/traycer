# Traycer Documentation

Welcome to the Traycer documentation! This guide will help you understand, use, and contribute to the Traycer VS Code extension.

## What is Traycer?

Traycer is a VS Code extension that acts as an intelligent planning layer for development tasks. It helps developers transform vague ideas into structured, actionable development plans, reducing "AI drift" and maintaining focus throughout implementation.

## Documentation Structure

### 📚 Core Documentation

- **[Architecture](architecture.md)** - System design, architecture decisions, and component overview
- **[Development](development.md)** - Setup, workflow, and development guidelines

### 🔌 API Documentation

- **[Core Modules](api/core.md)** - Plan generation, code analysis, and task parsing APIs
- **[Types & Interfaces](api/types.md)** - TypeScript types, interfaces, and data structures

### 📖 User Guides

- **[Getting Started](guides/getting-started.md)** - Quick start guide for users
- **[Usage Guide](guides/usage.md)** - How to use the extension effectively
- **[Contributing](guides/contributing.md)** - How to contribute to the project

## Quick Links

### For Users
- [Installation & Setup](guides/getting-started.md#installation)
- [Basic Usage](guides/usage.md#basic-usage)
- [Features Overview](guides/usage.md#features)
- [Keyboard Shortcuts](guides/usage.md#keyboard-shortcuts)

### For Developers
- [Development Setup](development.md#setup)
- [Project Structure](architecture.md#folder-structure)
- [Testing](development.md#testing)
- [Contributing Guidelines](guides/contributing.md)

### For AI Agents
- [AI Workflow Rules](../.ruler/03_ai_workflow.md)
- [Coding Style Guidelines](../.ruler/04_coding_style.md)
- [Testing Guidelines](../.ruler/07_testing_guidelines.md)
- [Security Guidelines](../.ruler/08_security_guidelines.md)

## Key Features

1. **Plan Generation** - Convert task descriptions into structured development plans
2. **Code Analysis** - Analyze workspace to understand project structure
3. **Interactive UI** - WebView-based plan viewer with progress tracking
4. **Implementation Verification** - Verify code changes match the plan
5. **File-Level Details** - Specific guidance on which files to create/modify

## Technology Stack

- **TypeScript** - Type-safe extension development
- **VS Code Extension API** - Extension host integration
- **React** - UI components for webview
- **Jest** - Testing framework
- **Node.js** - Runtime and file operations

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/traycer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/traycer/discussions)
- **Documentation**: You're here!

## Project Philosophy

Traycer is built on the principle that **structured planning prevents implementation drift**. By creating clear, actionable plans before writing code, developers can:

- Stay focused on the original goal
- Avoid scope creep
- Make better architectural decisions
- Reduce bugs and technical debt
- Improve code quality

## Contributing

We welcome contributions! Please read our [Contributing Guide](guides/contributing.md) to get started.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Next Steps:**
- New user? Start with [Getting Started](guides/getting-started.md)
- Want to understand the system? Read [Architecture](architecture.md)
- Ready to contribute? Check [Development Guide](development.md)
