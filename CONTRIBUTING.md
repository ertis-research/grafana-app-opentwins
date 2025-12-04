# Contributing to OpenTwins Grafana App Plugin

First off, thanks for taking the time to contribute! 🎉

The OpenTwins project is open source and we welcome contributions from the community. Whether you're fixing a bug, improving the documentation, or proposing a new feature, your help is appreciated.

## Development Workflow

To get started with development, please refer to the **Development** section in the [README.md](./README.md).

Make sure you have the correct environment:
- **Node.js 22**
- **Yarn**

## Code Style

We follow standard Grafana and React coding conventions.

* **Linting:** Please ensure your code passes linting before submitting. Run `yarn lint` (if available) or ensure your editor is configured with our `eslint.config.mjs`.

## Pull Request Process

1.  **Fork the repository** and create your branch from `main`.
3.  If you've changed APIs, update the documentation.
5.  Make sure your code builds successfully with `yarn build`.
6.  Issue that pull request!

## Commit Messages

We encourage the use of **Conventional Commits** to keep our history clean and readable.

* `feat:` A new feature
* `fix:` A bug fix
* `docs:` Documentation only changes
* `style:` Changes that do not affect the meaning of the code (white-space, formatting, etc)
* `refactor:` A code change that neither fixes a bug nor adds a feature
* `perf:` A code change that improves performance

Example:
```
feat: add new panel for digital twin state visualization
```

## Reporting Bugs

Bugs are tracked as GitHub issues. When filing an issue, please include:

1.  Your Grafana version.
2.  The browser and OS you are using.
3.  Steps to reproduce the bug.
4.  Any relevant logs from the browser console or Grafana server.

## License

By contributing, you agree that your contributions will be licensed under its Apache 2.0 License.