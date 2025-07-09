# card-ssr-react

- [React 18](https://reactjs.org/blog/2022/03/29/react-v18.html)
- [Typescript 4.9](https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/)
- [Vite with Vite SSR](https://vitejs.dev/guide/ssr.html)
- [GitHub Actions](https://github.com/features/actions)
- [Tailwind CSS](https://tailwindui.com/)
- [Prettier](https://prettier.io/) & [ESLint](https://eslint.org/)

## Development

```bash
yarn
yarn dev:server
```

## Building

```bash
yarn build
yarn serve
```

## Files

`eslintrc.js` - a barebones eslint configuration for 2021, that extends off of the recommended ESLint config and prettier

`.prettierrc.js` - the prettier config

`index.html` - the vite entrypoint, that includes the entry point for the client

`server.ts` - The barebones Express server with logic for SSRing Vite pages

`tailwind.config.cjs` - CommonJS module that defines the Tailwind config

`tsconfig.json` - TypeScript configuration

`vite.config.ts` - Vite configuration

## CI

We use GitHub actions to build the app.
