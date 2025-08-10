export const recursiveToSnake = (item: unknown): unknown => {
  if (Array.isArray(item)) {
    return item.map((el: unknown) => recursiveToSnake(el));
  } else if (typeof item === "function" || item !== Object(item)) {
    return item;
  }
  return Object.fromEntries(
    Object.entries(item as Record<string, unknown>).map(
      ([key, value]: [string, unknown]) => [
        key
          .split(/(?=[A-Z])/)
          .join("_")
          .toLowerCase(),
        recursiveToSnake(value),
      ],
    ),
  );
};

export const isFalsyOrEmptyObject = (obj?: object) => {
  if (!obj) return true;

  return obj.constructor === Object && !Object.keys(obj).length;
};
