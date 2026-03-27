export interface sessionTokenI {
  api_key: string;
  api_key_id: string;
  session_id: string;
  request_id: string;
  merchant_id: string;
  live_mode: boolean;
  exp: number;
}
