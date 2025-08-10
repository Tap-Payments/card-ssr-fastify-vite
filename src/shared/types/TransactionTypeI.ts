export interface TransactionTypeI {
  id: string;
  object: string;
  status: string;
  amount: number;
  currency: string;
  threeDSecure: boolean;
  card_threeDSecure: boolean;
  save_card: boolean;
  merchant_id: string;
  product: string;
  statement_descriptor: string;
  description: string;
  transaction: {
    timezone: string;
    created: string;
    url: string;
    expiry: {
      period: number;
      type: string;
    };
    asynchronous: boolean;
    amount: number;
    currency: string;
  };
  response: {
    code: string;
    message: string;
  };
  source: {
    object: string;
    id: string;
  };
  redirect: {
    status: string;
    url: string;
  };
  post: {
    status: string;
    url: string;
  };
}
