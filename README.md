# React TypeScript SSR with Fastify

A server-side rendered React application built with TypeScript, Fastify, and Vite.

## Project Structure

```
src/
├── client/          # Frontend React application
│   ├── App.tsx     # Main React component
│   ├── App.css     # Component styles
│   ├── index.css   # Global styles
│   ├── index.html  # HTML template
│   └── main.tsx    # Client entry point
├── server/          # Backend server code
│   ├── controllers/ # API controllers
│   │   └── exampleController.ts
│   ├── routes.ts   # API routes
│   └── ssr.ts      # Server-side rendering logic
└── index.ts        # Main server entry point
```

## Features

- ✅ React 18 with TypeScript
- ✅ Server-side rendering (SSR)
- ✅ Fastify backend with TypeScript
- ✅ Vite for fast development and building
- ✅ Client-side hydration
- ✅ API routes
- ✅ Hot reload during development

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Development mode:**

   ```bash
   npm run dev
   ```

   This will start both the build watcher and the development server.

3. **Production build:**
   ```bash
   npm run build
   npm start
   ```

## Available Routes

- **`/react`** - Main React SSR application
- **`/api/data`** - Example API endpoint
- **`/api/example`** - Another example API endpoint
- **`/health`** - Health check endpoint

## Scripts

- `npm run dev` - Start development mode with hot reload
- `npm run build` - Build for production
- `npm run build:client` - Build client-side assets only
- `npm run build:server` - Build server-side code only
- `npm run serve` - Start production server
- `npm start` - Build and start production server

## Development

The app runs on `http://localhost:3000` by default. The React application is available at `http://localhost:3000/react`.

During development, the client and server code are automatically rebuilt when files change. The server will restart automatically using nodemon.

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)
