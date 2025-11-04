# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a UnoCSS-specific element inspection tool project that provides browser devtools-like element inspection functionality, specifically optimized for the UnoCSS atomic CSS framework.

## Project Architecture

This is a monorepo project managed with pnpm workspace:

- `packages/inspector/` - Vue inspector component library providing core element inspection functionality
- `packages/unplugin/` - Universal unplugin supporting Vite, Webpack, Rollup and other build tools
- `playground/` - Testing and demonstration projects

### Core Architecture Design

1. **Inspector Component** (`packages/inspector/src/`):
   - Main entry: `src/index.ts` exports all components and functionality
   - Main component: `Inspector.vue` provides element selection and highlighting
   - Base components: `FormControl.vue`, `Select.vue` and other common UI components
   - Composables: `composables/` directory contains state management and logic reuse

2. **Unplugin** (`packages/unplugin/src/`):
   - Core plugin: `src/index.ts` uses unplugin to create cross-build-tool plugin
   - Platform adapters: Support for Vite, Webpack, Rollup and other build tools
   - Virtual modules: Inject inspector CSS and JS through virtual modules

## Common Development Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev              # Start inspector component development mode
pnpm play             # Start playground development

# Build
pnpm build            # Build all packages
pnpm deploy           # Build and deploy playground

# Testing
pnpm test             # Run all tests
vitest                # Run vitest directly

# Code Quality
pnpm lint             # Code linting
pnpm lint:fix         # Auto-fix lint issues
pnpm typecheck        # TypeScript type checking

# Individual package commands
pnpm -r --filter=./packages/inspector run build  # Build inspector component
pnpm -r --filter=./packages/unplugin run build   # Build unplugin
```

## Development Notes

1. **Monorepo Workflow**: Use `pnpm -r --filter=<package>` to execute commands for specific packages
2. **Dependency Management**: Uses pnpm catalogs to manage dependency versions and avoid conflicts
3. **Virtual Modules**: Unplugin injects resources through virtual modules, pay attention to virtual module path resolution
4. **Vue 3 Composition API**: Inspector components heavily use Vue 3 Composition API
5. **Cross-Build-Tool Compatibility**: Unplugin needs to be compatible with multiple build tools, ensure API generality

## Testing Configuration

The project uses Vitest for testing, config file: `vitest.config.ts`
- Test environment: happy-dom
- Coverage provider: v8
- Path alias: `@uno-inspect/inspector` points to `packages/inspector/src/index.ts`

## Publishing Process

1. Run `pnpm build` to build all packages
2. Check if build artifacts are correct
3. Publish to npm (requires proper publish permissions)
