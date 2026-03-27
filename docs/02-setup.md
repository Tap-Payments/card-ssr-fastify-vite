# Setup & Installation

## Prerequisites

| Requirement | Version | Notes |
| ----------- | ------- | ------------------- |
| Node.js | 20.x+ | Recommended for Vite 5 |
| Yarn | 1.22+ | Preferred package manager |
| Redis | 6.x+ | Required for server caching |

## Tech Stack Summary

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Fastify 5, Redis
- **Tooling**: Concurrent builds, Nodemon for API development

## Installation

### 1. Clone & Install

```bash
git clone <repository-url>
cd card-ssr-fastify-vite
yarn install
```

### 2. Environment Configuration

Create a `.env` or `.env.development` file in the root directory:

```env
PORT=4001
HOST=127.0.0.1
NODE_ENV=development
JWT_SECRET=your_secret_here
# Redis configuration
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. Development Mode

Starts the client build in watch mode and the Fastify server with hot reload:

```bash
yarn dev
```

## Available Scripts

| Script | Description |
| -------------- | ----------------------------------------------------------- |
| `yarn dev` | Run client builds in watch mode and start server via Nodemon |
| `yarn build` | Build client, wrapper, and server for production |
| `yarn start` | Run the compiled production bundle |
| `yarn build:client` | Build only the client-side React app |
| `yarn build:server` | Compile TypeScript server code |
| `yarn build:wrapper`| Build the application wrapper |

## Build Output

The build process generates files in the `dist/` directory:

- `dist/index.js`: Server entry point
- `dist/client/`: Static client assets
- `dist/wrapper/`: Static wrapper assets
- `dist/server/`: Compiled server logic

## Next Steps

- [Architecture](./03-architecture.md) - System design details
- [Folder Structure](./06-folder-structure.md) - Understanding the layout
- [Development Guide](./09-development-guide.md) - Contributing and coding standards
