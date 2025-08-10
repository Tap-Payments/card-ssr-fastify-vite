import { RegexPatterns } from "./constants";

export const allCharsInEN = (value: string) =>
  RegexPatterns.ENGLISH_ALPHANUMERIC.test(value);

export const removeWhitespaces = (value: string) =>
  value.replace(RegexPatterns.WHITESPACES, "");

export const removeNonHolderNameChars = (value: string) =>
  value.replace(RegexPatterns.NOT_HOLDER_NAME, "");
export const isValidHolderName = (value: string) =>
  !RegexPatterns.NOT_HOLDER_NAME.test(value);
export const resetEmptyString = (value: string | undefined) =>
  value?.trim() || undefined;

export function isValidString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

export function cleanCountryCode(countryCode: string): string {
  if (countryCode.startsWith(" ") && !countryCode.startsWith("+")) {
    countryCode = "+" + countryCode.trim();
  }
  return countryCode;
}
