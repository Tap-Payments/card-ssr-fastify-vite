import path from "path";
import fs from "fs";
import ErrorHandler from "../services/ErrorHandler.js";
import type { BackendAPIError } from "../api/HTTPClient.js";

class WrapperController {
  /**
   * Serves the wrapper's main HTML file.
   */
  async makeWrapper(_request: any, _fastify: any, reply: any) {
    try {
      const wrapperDistPath = path.join(process.cwd(), "dist/wrapper");
      let htmlTemplate: string;
      try {
        htmlTemplate = fs.readFileSync(path.join(wrapperDistPath, "index.html"), "utf-8");
      } catch (error) {
        // Fallback HTML template if build files don't exist
        htmlTemplate = `
            <!DOCTYPE html>
            <html lang="en">
              <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>React ERROR SSR App</title></head>
              <body>
                <div id="root"></div>
                <script type="module" src="/static/wrapper/assets/main.js"></script>
              </body>
            </html>`;
      }
      reply.type("text/html").send(htmlTemplate);
    } catch (error) {
      const err = error as BackendAPIError;
      console.error("Error rendering wrapper:", err);
      ErrorHandler.sendErrorResponse(err, reply);
    }
  }
}

export default new WrapperController();