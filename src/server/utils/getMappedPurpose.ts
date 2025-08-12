import { Purpose } from '../../shared/types/index.js';
import { toSnakeCase } from './string.js';

export const getMappedPurpose = (purpose?: string): Purpose | undefined => {
  if (!purpose) return Purpose.CHARGE;
  return toSnakeCase(purpose.toUpperCase())?.replace('CARD', 'TOKEN') as Purpose;
};
