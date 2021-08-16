/**
 * unique given array elements using Set
 * @param arr - given array
 * @returns uniqued array
 */
export const unique = <T = any>(arr: T[]): T[] => {
  return [...new Set(arr)]
}
