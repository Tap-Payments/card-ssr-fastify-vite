# Development Guide

## Project Architecture Overview

This project is structured as a multi-package application managed within a single repository (monorepo-style). It consists of:
- **Client**: Main React application.
- **Server**: Fastify-based backend with SSR.
- **Shared**: Common types, utils, and configurations.
- **Wrapper**: Independent application wrapper.

## Adding a New Feature

When adding features, consider which layer it belongs to:

1.  **Shared Logic**: Add to `src/shared/` if it's used by both client and server.
2.  **UI Components**: Add to `src/client/components/` for main app components.
3.  **API Routes**: Add to `src/server/routes/` and implement controllers in `src/server/controllers/`.
4.  **Hooks**: Use `src/client/hooks/` for UI logic and `src/server/services/` for backend logic.

## Developing Locally

### 1. Prerequisite Scripts
Before starting, ensure theme and locale files are generated:
```bash
yarn predev
```

### 2. Start Development Server
Starts all builds in watch mode and runs the server with Nodemon:
```bash
yarn dev
```

## Adding a New Route (Fastify)

1.  **Define Route**: In `src/server/routes/api/`, create a new route file.
2.  **Implementation**:
    ```typescript
    import { FastifyInstance } from 'fastify';

    export default async function (fastify: FastifyInstance) {
      fastify.get('/my-new-route', async (request, reply) => {
        return { success: true };
      });
    }
    ```
3.  **Register Route**: Ensure it's registered in `src/server/config/app.ts` or similar.

## Adding a Client Component

1.  **Location**: `src/client/components/{Category}/{ComponentName}.tsx`
2.  **Pattern**:
    ```tsx
    import React from 'react';

    export const MyComponent: React.FC = () => {
      return <div>Hello</div>;
    };
    ```

## Adding Shared Types

1.  **Location**: `src/shared/types/`
2.  **Export**: Ensure types are exported from `index.ts` in the shared directory so they can be easily imported by both client and server.

## Building for Production

```bash
yarn build
```
This runs:
- `vite build --config vite.config.client.ts`
- `vite build --config vite.config.wrapper.ts`
- `tsc -p tsconfig.server.json`

## Code Style & Standards

- **TypeScript**: Use strict typing. Avoid `any`.
- **JSDoc**: Document all public functions and classes.
- **Naming**: 
  - Components: `PascalCase`.
  - Utils/Hooks: `camelCase`.
  - Files: Match export name.

## Deployment Checklist

- [ ] Check `.env.production` values.
- [ ] Run `yarn build` and verify output in `dist/`.
- [ ] Ensure Redis is accessible in the production environment.
- [ ] Test the production build locally using `yarn start`.

## Next Steps

- [Architecture](./03-architecture.md) - System design details
- [Folder Structure](./06-folder-structure.md) - Navigating the codebase
- [Setup](./02-setup.md) - Environment and installation
