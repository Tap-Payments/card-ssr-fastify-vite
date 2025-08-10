/**
 * @param {number} size - the size of the cvv ex: 3 or 4
 * @returns {string} mask ex "999" or "9999"
 * @description -
 * The "react-input-mask" expects a string of 9s with the length of the cvv size.
 * Example size: 3 mask="999"  , size: 4 mask="9999"
 */
export function maskStringFromNumber(size: number): string {
  return Array.from({ length: size }, () => "_").join("");
}
