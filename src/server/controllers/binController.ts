import API from "../api/index.js";
import ErrorHandler from "../services/ErrorHandler.js";
import type { BackendAPIError } from "../api/HTTPClient.js";

class BinController {
  /**
   * Fetches BIN details based on the BIN ID.
   */
  async getBin(request: any, fastify: any, reply: any) {
    try {
      const response = await API.cardService.getBin(
        request.xTapSecretKey,
        request.params.id
      );

      const { data, status } = response;
      await reply.code(status).send(data);
    } catch (error: unknown) {
      const err = error as BackendAPIError;
      ErrorHandler.sendErrorResponse(err, reply);
    }
  }
}

export default new BinController();