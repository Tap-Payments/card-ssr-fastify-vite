/* eslint-disable @typescript-eslint/ban-types */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeneralObject = Record<string, any>;

export type ExtendableString<T> = T extends string ? T | (string & {}) : never;

export type ExtendableObject<T> = T extends GeneralObject ? T & GeneralObject : never;
