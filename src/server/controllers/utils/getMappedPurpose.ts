import { Purpose } from '../../../shared/types'
import { toSnakeCase } from '../../utils/string'

export const getMappedPurpose = (purpose?: string): Purpose | undefined => {
	if (!purpose) return Purpose.CHARGE
	return toSnakeCase(purpose.toUpperCase())?.replace('CARD', 'TOKEN') as Purpose
}
