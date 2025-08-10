export interface CardVerifyI {
  id: string;
  object: string;
  live_mode: boolean;
  api_version: string;
  status: "INITIATED" | "VALID" | "INVALID";
  currency: string;
  threeDSecure: boolean;
  save_card: boolean;
  transaction: {
    timezone: string;
    created: string;
    url: string;
    asynchronous: false;
    amount: 0;
  };
  customer: {
    id: string;
    first_name: string;
    phone: {
      country_code: string;
      number: string;
    };
  };
  source: {
    object: string;
    id: string;
  };
  redirect: {
    status: string;
    url: string;
  };
  card: {
    object: string;
    first_six: string;
    last_four: string;
    name: string;
    expiry: {
      month: string;
      year: string;
    };
  };
  response: {
    code: string;
    message: string;
  };
  risk: boolean;
  issuer: boolean;
  promo: boolean;
  loyalty: boolean;
  card_issuer: {
    id: string;
    name: string;
    country: string;
  };
}
