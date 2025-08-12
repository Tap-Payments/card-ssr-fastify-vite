export const resetEmptyString = (value: string | undefined) =>
  value?.trim() || undefined;

export function toSnakeCase(value: string) {
  const trimmedValue = value.trim().replace(/ /g, "_");
  return trimmedValue;
}
