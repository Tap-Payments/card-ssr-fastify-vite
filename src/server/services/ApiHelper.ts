import axios from "axios";
import UtilityHelper from "./UtilityHelper.js";
export default class ApiHelper {
  static isLivePublicKey(pk: string) {
    return pk.includes("pk_live");
  }
  static async mapRequestFromHeader(
    requestBody: any,
    headerApplication: string
  ): Promise<any> {
    const ipAddress = requestBody.client_ip;
    let responseIpInfo: any = null;
    if (ipAddress && process.env.IP_INFO_ACCESS_KEY) {
      responseIpInfo = await axios.get(
        `https://api.ipapi.com/${ipAddress}?access_key=${process.env.IP_INFO_ACCESS_KEY}`
      );
    }

    //handle mapping without consent
    if (headerApplication) {
      const decodedApplication =
        UtilityHelper.parseHeaderString(headerApplication);

      const { at, bn, bi, cu, aid, an, av, ro, rov, rm, rt, rn } =
        decodedApplication;

      if (!requestBody.browser) {
        requestBody.browser = {};
      }

      if (!requestBody.app) {
        requestBody.app = {};
      }

      const device = requestBody.device;
      if (!device) {
        requestBody.device = {};
      }
      if (!device.operating_system) {
        device.operating_system = {};
      }

      if (!device.brand) {
        device.brand = {};
      }

      device.source = UtilityHelper.replaceIfPresent(
        at === "browser" ? "web" : at,
        device.source
      );
      requestBody.browser.name = UtilityHelper.replaceIfPresent(
        bn,
        requestBody.browser.name
      );
      requestBody.browser.id = UtilityHelper.replaceIfPresent(
        bi,
        requestBody.browser.id
      );
      requestBody.app.store_id = UtilityHelper.replaceIfPresent(
        cu,
        requestBody.app.store_id
      );
      requestBody.app.name = UtilityHelper.replaceIfPresent(
        aid != undefined && aid !== "" ? aid : an,
        requestBody.app.name
      );
      requestBody.app.version = UtilityHelper.replaceIfPresent(
        av,
        requestBody.app.version
      );
      device.operating_system.name = UtilityHelper.replaceIfPresent(
        ro,
        device.operating_system?.name
      );
      device.operating_system.version = UtilityHelper.replaceIfPresent(
        rov,
        device.operating_system?.version
      );
      device.brand.name = UtilityHelper.replaceIfPresent(
        ro != undefined && ro !== "" ? ro : rm,
        device.brand?.name
      );
      device.brand.type = UtilityHelper.replaceIfPresent(
        rt,
        device.brand?.type
      );
      device.name = UtilityHelper.replaceIfPresent(rn, device?.name);
      if (device.source == "app") {
        let store = "";
        if (device.operating_system.name?.toLowerCase() === "ios")
          store = "app_store";
        if (device.operating_system.name?.toLowerCase() === "android")
          store = "play_store";
        requestBody.app.store = store;
      } else {
        requestBody.app.store = device.operating_system.name;
      }
      if (responseIpInfo) {
        if (
          responseIpInfo.status == 200 &&
          responseIpInfo.data.ip == ipAddress
        ) {
          if (responseIpInfo.data.country_code) {
            requestBody.device.country_code = responseIpInfo.data.country_code;
          }
          if (responseIpInfo.data.ip) {
            requestBody.device.ip = responseIpInfo.data.ip;
          }
        }
      }
    }
    return requestBody;
  }
}
