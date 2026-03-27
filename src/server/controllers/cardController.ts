import path from "path";
import fs from "fs";
import RedisHelper from "../services/RedisHelper.js";
import CryptoHelper from "../services/CryptoHelper.js";
import API from "../api/index.js";
import ErrorHandler from "../services/ErrorHandler.js";
import ApiHelper from "../services/ApiHelper.js";
import { Integration } from "../../shared/types/index.js";
import { getMappedConfigObject } from "../utils/getMappedConfigObject.js";
import { getBackupConfig } from "../utils/getBackupConfig.js";

// Type Imports
import type { BackendAPIError } from "../api/HTTPClient.js";
import type { ConfigObject, Device } from "../types/config.js";
import type { getMappedAuth } from "../utils/getMappedAuth.js";
import type { getMappedPaymentOption } from "../utils/getMappedPaymentOption.js";

class CardController {
  /**
   * Checks if the card form is loaded within the checkout/webview integration.
   * @private
   */
  _isCardLoadedInternally(integration: Integration, session: string) {
    return (
      [Integration.CHECKOUT, Integration.WEBVIEW].includes(integration) &&
      !!session
    );
  }

  /**
   * Fetches all necessary data for rendering the card profile.
   */
  async getCardProfileData(request: any, fastify: any, reply: any) {
    let isNewConfig = false;
    if (request.query.config) {
      isNewConfig = true;
      const config = JSON.parse(request.query.config) as ConfigObject;
      const device = JSON.parse(request.query.device) as Device;
      request.query = {
        ...request.query,
        ...getMappedConfigObject({ config, device }),
      };
    } else {
      isNewConfig = false;
      const mappedConfig = getBackupConfig({ query: request.query });
      request.query = {
        ...request.query,
        ...mappedConfig,
      };
    }

    const {
      publicKey,
      referer: refererQuery,
      session: checkoutSession,
      mdn: mdnQuery = "",
      application,
      integration,
      mid,
      sdkSource,
      domain,
    } = request.query;
    const { query } = request;

    // Ensure nested JSON objects in query params are parsed
    if (query.paymentOptions && typeof query.paymentOptions === "string") {
      query.paymentOptions = JSON.parse(
        decodeURIComponent(query.paymentOptions)
      );
    }
    if (query.style) query.style = JSON.parse(query.style);
    if (query.errors) query.errors = JSON.parse(query.errors);

    const {
      customer: customerId,
      supportedCurrencies,
      supportedPaymentMethods,
      cardCVV,
      currencyCode,
    } = query.paymentOptions as ReturnType<typeof getMappedPaymentOption>;

    const {
      authentication: { purpose },
    } = JSON.parse(decodeURIComponent(query.authentication)) as ReturnType<
      typeof getMappedAuth
    >;

    const acceptance = request.query.acceptance as ConfigObject["acceptance"];

    const request_body = {
      customer: { id: customerId },
      payment_type: "CARD",
      merchant_id: mid,
      supported_currencies: supportedCurrencies,
      supported_payment_methods: supportedPaymentMethods,
      supported_regions: acceptance?.supportedRegions,
      supported_countries: acceptance?.supportedCountries,
      supported_payment_types: acceptance?.supportedPaymentTypes,
      supported_schemes: acceptance?.supportedSchemes,
      scope: query.scope,
      purpose: purpose,
      currency: currencyCode,
      field_visibility: {
        card: {
          cvv: cardCVV ?? true,
        },
      },
    };

    const decryptedMdn = await CryptoHelper.decryptMdn(
      mdnQuery.replaceAll(" ", "+")
    );
    const referer = !!refererQuery
      ? CryptoHelper.decryptMdn(refererQuery.replaceAll(" ", "+"))
      : decryptedMdn;
      
    try {
      if (this._isCardLoadedInternally(integration, checkoutSession)) {
        const decodedToken = fastify.jwt.decode(checkoutSession);
        const isLivePK = ApiHelper.isLivePublicKey(publicKey);
        CryptoHelper.decrypt(decodedToken.key, isLivePK);
        await RedisHelper.setKey(fastify, `${publicKey}`, decodedToken.key, reply);

        reply.statusCode = 200;
        return {
          ENABLE_REDUX_TOOLKIT: process.env.ENABLE_REDUX_TOOLKIT,
          referer,
          encryption_key: "",
          config: JSON.stringify(request.query),
          payment_options: JSON.stringify([]),
          cards: JSON.stringify([]),
          merchantAssets: JSON.stringify([]),
          error: JSON.stringify(null),
          integration: JSON.stringify(integration),
          session: JSON.stringify(checkoutSession),
          permission: JSON.stringify(null),
          isNewConfig: JSON.stringify(isNewConfig),
        };
      }
      const { data } = await API.profileService.cardProfile(
        publicKey,
        application,
        decryptedMdn,
        request_body
      );
      const decodedToken = fastify.jwt.decode(data.merchant.session_token);
      await RedisHelper.setKey(fastify, `${publicKey}`, decodedToken.api_key, reply);
      
      const {
        merchant: { encryption_key, permission, powered_by },
        payment_options,
        assests: merchantAssets,
      } = data;

      reply.statusCode = 200;
      return {
        ENABLE_REDUX_TOOLKIT: process.env.ENABLE_REDUX_TOOLKIT,
        referer,
        encryption_key,
        config: JSON.stringify(request.query),
        payment_options: JSON.stringify(payment_options.payment_methods),
        cards: JSON.stringify(payment_options.cards),
        merchantAssets: JSON.stringify(merchantAssets),
        error: JSON.stringify(null),
        integration: JSON.stringify(integration),
        session: JSON.stringify(null),
        permission: JSON.stringify({ ...permission, powered: powered_by }),
        isNewConfig: JSON.stringify(isNewConfig),
      };
    } catch (error: any) {
        const err = error as BackendAPIError;
        const errorData = err.data?.[0] || err.data || { code: "UNKNOWN_ERROR", message: error.message || "Unknown error" };
        reply.statusCode = err.statusCode || 400;
        return {
            ENABLE_REDUX_TOOLKIT: process.env.ENABLE_REDUX_TOOLKIT,
            referer,
            encryption_key: "",
            config: JSON.stringify(request.query),
            payment_options: JSON.stringify([]),
            cards: JSON.stringify([]),
            merchantAssets: JSON.stringify([]),
            error: JSON.stringify(errorData),
            integration: JSON.stringify(integration),
            session: JSON.stringify(null),
            permission: JSON.stringify(null),
            isNewConfig: JSON.stringify(isNewConfig),
        };
    } finally {
        const invalidHosts = ["0.0.0.0", "dev", "staging"];
        if (!invalidHosts.some((substring) => request.headers.host.includes(substring))) {
            ErrorHandler.logSdkSourceToSlack({
                publicKey,
                mid,
                sdkSource,
                host: request.headers.host,
                client: domain || decryptedMdn,
            });
        }
    }
  }

  /**
   * Renders the HTML frame with server-side data.
   * @private
   */
  async _renderFrame(request: any, fastify: any, reply: any) {
    const results = await this.getCardProfileData(request, fastify, reply);
    try {
      const clientDistPath = path.join(process.cwd(), "dist/client");
      let htmlTemplate: string;
      try {
        htmlTemplate = fs.readFileSync(path.join(clientDistPath, "index.html"), "utf-8");
      } catch (error) {
        // Fallback HTML template for development or if build files are missing
        htmlTemplate = `
            <!DOCTYPE html>
            <html lang="en">
              <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>React ERROR SSR App</title></head>
              <body>
                <div id="root"></div>
                <script type="module" src="/static/assets/main.js"></script>
              </body>
            </html>`;
      }

      // Inject server-side data into a script tag for the client to hydrate
      const html = htmlTemplate.replace(
        "",
        `<script type="application/json" id="ssr-data">${JSON.stringify({
          isServer: true,
          cardConfiguration: results,
        })}</script>`
      );
      return html;
    } catch (error) {
      console.error("Error rendering app:", error);
      throw error;
    }
  }

  /**
   * Main handler to create and send the HTML frame.
   */
  async makeFrame(request: any, fastify: any, reply: any) {
    try {
      const html = await this._renderFrame(request, fastify, reply);
      reply.type("text/html").send(html);
    } catch (error: unknown) {
      const err = error as BackendAPIError;
      ErrorHandler.sendErrorResponse(err, reply);
    }
  }
}

export default new CardController();