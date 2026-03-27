# Project Overview

## Card SSR Fastify Vite
A robust, high-performance SSR (Server-Side Rendering) architecture for the Tap Payments Card SDK. This project combines React for the UI, Fastify for the server, and Vite for lightning-fast builds and HMR.

## Core Capabilities

- **Server-Side Rendering (SSR)**: Improved initial load performance and SEO.
- **Fastify Server**: Highly efficient and extensible backend.
- **Vite Integration**: Modern build tool replacing legacy Webpack.
- **Redis Caching**: Built-in support for Redis to optimize state and data management.
- **Secure Card Processing**: PCI-compliant handling of sensitive card data.
- **Multi-language Support**: English and Arabic localization.
- **Dynamic Theming**: Support for light, dark, and system-preferred themes.

## Tech Stack

| Component | Technology | Version | Purpose |
| --------- | ------------------ | ------- | -------------------- |
| **Runtime (Client)** | React | 18.2.0 | UI framework |
| **Runtime (Server)** | Fastify | 5.4.0 | Web server framework |
| **Build Tool** | Vite | 5.2.0 | Build and HMR |
| **Language** | TypeScript | 5.4.0 | Type-safe development |
| **Static Analysis** | ESLint / Prettier | Latest | Code quality and formatting |
| **State Management**| Redux Toolkit | Latest | Client-side state |
| **Database/Cache**  | Redis | 4.6.5+  | Caching and session storage |

## Architecture High-Level

This project uses a hybrid architecture where Fastify serves both the static client assets and handles SSR for the main application and a wrapper component.

```
[Browser] <--> [Fastify Server (PORT 4001)]
                 |
                 +-- [SSR / React]
                 +-- [API Proxy / Routes]
                 +-- [Redis Cache]
```

## Next Steps

- [Setup](./02-setup.md) - Installation and getting started
- [Architecture](./03-architecture.md) - Deep dive into system design
- [Folder Structure](./06-folder-structure.md) - Understanding the layout
- [Development Guide](./09-development-guide.md) - How to contribute
