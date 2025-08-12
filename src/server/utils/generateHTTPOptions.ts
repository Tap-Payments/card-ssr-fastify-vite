import { AxiosRequestConfig } from "axios";

interface GenerateHTTPOptionsProps {
  publicKey: string;
  mdn?: string;
  application?: string;
}
export function generateHTTPOptions({
  publicKey,
  mdn,
  application,
}: GenerateHTTPOptionsProps): AxiosRequestConfig {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${publicKey}`,
      mdn: mdn,
      application: application,
    },
  };
}
