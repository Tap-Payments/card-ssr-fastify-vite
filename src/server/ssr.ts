import React from "react";
import { renderToString } from "react-dom/server";
import fs from "fs";
import path from "path";

// Import the shared React app component

export async function renderApp(): Promise<string> {
  try {
    // Read the client-side HTML template
    const clientDistPath = path.join(process.cwd(), "dist/client");
    let htmlTemplate: string;

    try {
      htmlTemplate = fs.readFileSync(
        path.join(clientDistPath, "index.html"),
        "utf-8",
      );
    } catch (error) {
      // Fallback HTML template if built files don't exist
      htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>React SSR App</title>
          </head>
          <body>
            <div id="root"><!--app-html--></div>
            <script type="module" src="/static/assets/main.js"></script>
          </body>
        </html>
      `;
    }

    // Replace placeholder with server-rendered HTML
    const html = htmlTemplate.replace(
      "<!--ssr-data-->",
      `<script type="application/json" id="ssr-data">${JSON.stringify({ isServer: true })}</script>`,
    );
    return html;
  } catch (error) {
    console.error("Error rendering app:", error);
    throw error;
  }
}
