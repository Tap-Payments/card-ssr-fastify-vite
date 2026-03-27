import API from "../api/index.js";
import ErrorHandler from "../services/ErrorHandler.js";
import ApiHelper from "../services/ApiHelper.js";
import type { BackendAPIError } from "../api/HTTPClient.js";

class TokenController {
  /**
   * Creates a token from card data.
   */
  async createToken(request: any, fastify: any, reply: any) {
    try {
      const { encryptedData, ...otherData } = request.body;
      let request_token: any = {};

      if (encryptedData !== undefined) {
        request_token = {
          card: {
            crypted_data: encryptedData,
          },
          ...otherData,
        };
      } else {
        request_token = request.body;
      }

      const mappedRequest = await ApiHelper.mapRequestFromHeader(
        request_token,
        request.headers.application
      );

      const response = await API.cardService.createToken(
        request.xTapSecretKey,
        mappedRequest
      );
      const { data, status } = response;
      await reply.code(status).send(data);
    } catch (error: unknown) {
      const err = error as BackendAPIError;
      ErrorHandler.sendErrorResponse(err, reply);
    }
  }
}

export default new TokenController();