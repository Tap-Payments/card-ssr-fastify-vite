import { sanitise } from "@sanitise/uri";
import CryptoHelper from "./CryptoHelper.js";
import RedisHelper from "./RedisHelper.js";
import ApiHelper from "./ApiHelper.js";
export default class RequestParser {
  static frameRequestParser(request: any, reply: any, done: any) {
    if (typeof request.query.publicKey === "undefined") {
      reply.statusCode = 400;
      reply.send({ message: "Invalid request" });
      return;
    }
    const referer = sanitise(request.headers.referer);
    if (
      referer == undefined &&
      typeof request.query.tap_id === "undefined" &&
      typeof request.query.auth_payer === "undefined"
    ) {
      if (
        true
        //request.query.integration &&
        //request.query.integration === "webview"
      ) {
        // done();
      } else {
        const response = {
          message: "Invalid Request Attempt",
        };
        reply.statusCode = 400;
        reply.send(response);
        return;
      }
    }
    done();
  }

  static async APIRequestParser(
    fastify: any,
    request: any,
    reply: any,
    done: any
  ) {
    if (typeof request.headers.authorization === "undefined") {
      reply.statusCode = 400;
      reply.send({ message: "Invalid request" });
      return;
    } else {
      const authorization = request.headers.authorization;
      const encryptedKey = await RedisHelper.getKey(fastify, authorization);
      if (encryptedKey == null) {
        reply.statusCode = 410;
        reply.send({ message: "Session timed out" });
        return;
      } else {
        const isLivePK = ApiHelper.isLivePublicKey(authorization);
        const decrypted = await CryptoHelper.decrypt(encryptedKey, isLivePK);
        request.xTapSecretKey = decrypted;
      }
    }
    done();
  }
}
