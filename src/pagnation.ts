import { parseIntOrDefault } from './string'

export interface Pagnation {
  offset: number
  limit: number
}

export interface PagnationPage {
  current?: string
  pageSize?: string
}

export interface PagnationOffset {
  limit?: string
  offset?: string
}

/**
 * convert \{ current, pageSize \} into \{ offset, limit \}
 * @param qs - query object
 * @param defaultPageSize - default is 100
 * @returns
 */
export const parsePagnation = <T extends PagnationPage>(
  qs: T,
  defaultPageSize: number = 100
): Pagnation => {
  const current = Math.max(parseIntOrDefault(qs.current, 1), 1)
  const pageSize = Math.max(parseIntOrDefault(qs.pageSize, defaultPageSize), 1)

  return {
    offset: Math.max((current - 1) * pageSize, 0),
    limit: pageSize,
  }
}

/**
 * normalize \{ offset, limit \}
 * @param qs - query object
 * @param defaultLimit - default is 100
 * @returns
 */
export const parsePagnationOffsetLimit = <T extends PagnationOffset>(
  qs: T,
  defaultLimit: number = 100
): Pagnation => {
  const limit = Math.max(parseIntOrDefault(qs.limit, defaultLimit), 1)
  const offset = Math.max(parseIntOrDefault(qs.offset, 0), 0)

  return {
    offset,
    limit,
  }
}
