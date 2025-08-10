import { Card } from "./Card";

export interface TokenTypeI {
  id: string;
  live_mode: string;
  type: string;
  used: string;
  card: Card;
}
