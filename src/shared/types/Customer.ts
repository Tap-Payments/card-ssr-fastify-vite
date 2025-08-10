import { Locale } from "./enum";

export interface Customer {
  id?: string; //"OPTIONAL : Customer ID",
  name?: {
    lang: Locale; //"REQUIRED : en or ar",
    first: string; // "OPTIONAL : First name of the customer.",
    last: string; //"OPTIONAL : Last name of the customer.",
    middle?: string; // "OPTIONAL : Middle name of the customer.",
  }[];
  nameOnCard?: string; //"OPTIONAL : To prefill the card holder name with this value.",
  editable?: boolean; //Default is true, card name editing

  contact?: {
    // Defines the contact details for the customer & to be used in creating the billing contact info in Apple pay request
    email?: string; //"OPTIONAL :  The customer's email",
    phone?: {
      countryCode: string; //"OPTIONAL :  The customer's country code",
      number: string; //"OPTIONAL :  The customer's phone number
    }; //"OPTIONAL :  The customer's phone number"
  };
}
