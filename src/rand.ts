/**
 * random float in range [min, max)
 * @param min
 * @param max
 * @returns
 */
export const randRangeFloat = (min: number, max: number) => {
  return min + Math.random() * (max - min)
}

/**
 * random int in range [min, max)
 * @param min
 * @param max
 * @returns
 */
export const randRangeInt = (min: number, max: number) => {
  return Math.floor(randRangeFloat(min, max))
}
