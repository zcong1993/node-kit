/**
 * random float in range [min, max)
 * @param min - min number
 * @param max - max number
 * @returns
 */
export const randRangeFloat = (min: number, max: number) => {
  return min + Math.random() * (max - min)
}

/**
 * random int in range [min, max)
 * @param min - min number
 * @param max - max number
 * @returns
 */
export const randRangeInt = (min: number, max: number) => {
  return Math.floor(randRangeFloat(min, max))
}

/**
 * convert a base number to (base*(1-deviation), base*(1+deviation)]
 * commonly used to prevent a large number of caches from expiring at the same time
 * @param base - base number
 * @param deviation - deviation should in [0, 1]
 * @returns
 */
export const unstableDeviation = (base: number, deviation: number) => {
  if (deviation < 0) {
    deviation = 0
  }

  if (deviation > 1) {
    deviation = 1
  }

  return (1 + deviation - 2 * deviation * Math.random()) * base
}

/**
 * same like unstableDeviation but return int, [base*(1-deviation), base*(1+deviation)]
 * @param base - base number
 * @param deviation - deviation should in [0, 1]
 * @returns
 */
export const unstableDeviationInt = (base: number, deviation: number) =>
  Math.floor(unstableDeviation(base, deviation))
