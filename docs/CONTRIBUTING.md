# Contributing Guide

Before you start contributing, please take a moment to:

1. Read through this guide
2. Familiarize yourself with our codebase
3. Check out our issue tracker for open tasks
4. Join our community discussions

# Developing

## Local Development

1. Clone the repo.

```bash
git clone https://github.com/spurintel/javascript
```

2. Enable `pnpm`.

```bash
corepack enable pnpm
```

3. Install dependencies. This repo uses pnpm workspaces, so you **should always run `pnpm install` from the root of the monorepo**. This will install dependencies for all packages.

```bash
pnpm install
```

4. Build all packages.

```bash
pnpm build
```
