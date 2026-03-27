import API from "../api/index.js";
import ErrorHandler from "../services/ErrorHandler.js";
import ApiHelper from "../services/ApiHelper.js";
import type { BackendAPIError } from "../api/HTTPClient.js";

class AuthenticateController {
  /**
   * Creates a new authentication record.
   */
  async createAuthenticate(request: any, fastify: any, reply: any) {
    try {
      const mappedRequest = await ApiHelper.mapRequestFromHeader(
        request.body,
        request.headers.application
      );

      const response = await API.authenticateService.createAuthenticate(
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

  /**
   * Retrieves an authentication record by its ID.
   */
  async getAuthenticate(request: any, fastify: any, reply: any) {
    try {
      const response = await API.authenticateService.getAuthenticate(
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

export default new AuthenticateController();