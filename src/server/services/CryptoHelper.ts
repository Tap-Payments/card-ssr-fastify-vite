import NodeRSA from "node-rsa";

export default class CryptoHelper {
  static decrypt(encryptedData: string, isLive: boolean) {
    const RSA_PRIVATE_KEY = isLive
      ? `${process.env.LIVE_KEY_CARD}`
      : `${process.env.SANDBOX_KEY_CARD}`;
    const privateKey = new NodeRSA(RSA_PRIVATE_KEY);
    privateKey.setOptions({
      encryptionScheme: "pkcs1",
      environment: "browser",
    });
    return privateKey.decrypt(encryptedData).toString("utf8");
  }

  static decryptMdn(encryptedData: string) {
    const RSA_PRIVATE_KEY = `${process.env.KEY_BROWSER}`;
    const privateKey = new NodeRSA(RSA_PRIVATE_KEY);
    privateKey.setOptions({
      encryptionScheme: "pkcs1",
      environment: "browser",
    });
    return privateKey.decrypt(encryptedData).toString("utf8");
  }
}
