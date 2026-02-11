# Folder Structure

## Project Root

```
card-ssr-fastify-vite/
├── docs/                 # Documentation
├── scripts/              # Build and generation scripts
│   ├── generateLocale.js
│   └── generateTheme.js
├── shared/               # Shared assets/configs between scripts and app
├── src/                  # Source code
│   ├── client/           # Client-side React application
│   ├── server/           # Fastify server
│   ├── shared/           # Shared code (types, utils, config)
│   ├── wrapper/          # Wrapper application
│   └── index.ts          # Server entry point
├── dist/                 # Compiled output (generated)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.*.ts      # Vite configurations for client and wrapper
```

## Source Directory (`src/`)

### 1. Client (`src/client/`)
The main React application that runs in the browser.
- **api/**: Client-side API calls and hooks.
- **components/**: UI components.
- **features/**: Feature-based modules.
- **hooks/**: Custom React hooks.
- **pages/**: Application pages/routes.
- **utils/**: Client-side utilities.
- **main.tsx**: Client entry point.

### 2. Server (`src/server/`)
Fastify-based backend providing SSR and API routes.
- **api/**: External API integrations.
- **config/**: Server configurations (Fastify, Redis, etc.).
- **controllers/**: Business logic for routes.
- **plugins/**: Fastify plugins.
- **routes/**: Route definitions.
- **services/**: Internal services (e.g., ErrorHandler).
- **types/**: Server-specific types.
- **app.ts**: Fastify application setup.

### 3. Shared (`src/shared/`)
Code used by both client and server.
- **config/**: Shared configurations.
- **data/**: Shared data/constants.
- **types/**: Shared TypeScript interfaces and enums.

### 4. Wrapper (`src/wrapper/`)
A separate application wrapper, likely for iframe or standalone usage.
- **hooks/**: Wrapper-specific hooks.
- **pages/**: Wrapper pages.
- **main.tsx**: Wrapper entry point.

## Naming Conventions

| Type | Pattern | Example |
| -------------- | --------------------- | ---------------------- |
| **Component** | `{Name}.tsx` | `TapCard.tsx` |
| **Hook** | `use{Name}.ts` | `useTokenization.ts` |
| **Utility** | `{name}.ts` | `encryption.ts` |
| **Type/Enum** | `{Name}.ts` | `Config.ts` |

## Next Steps

- [Setup](./02-setup.md) - Installation and scripts
- [Architecture](./03-architecture.md) - System design details
- [Development Guide](./09-development-guide.md) - Adding features
