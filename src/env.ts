export class EnvVal {
  constructor(private val: string | undefined, private key: string) {}

  string() {
    return this.val
  }

  bool(trueVals: string[] = ['true', '1']) {
    return this.val && trueVals.includes(this.val)
  }

  int() {
    if (this.val === undefined) {
      return this.val
    }

    const num = parseInt(this.val, 10)
    if (isNaN(num)) {
      throw new Error(`key: ${this.key}, val: ${this.val} is not a int number`)
    }
    return num
  }

  float() {
    if (this.val === undefined) {
      return this.val
    }

    const num = parseFloat(this.val)
    if (isNaN(num)) {
      throw new Error(
        `key: ${this.key}, val: ${this.val} is not a float number`
      )
    }
    return num
  }

  date() {
    if (this.val === undefined) {
      return this.val
    }

    const d = new Date(this.val)
    if (isNaN(d.getTime())) {
      throw new Error(`key: ${this.key}, val: ${this.val} is an invalid date`)
    }
    return d
  }

  array(separator = ','): string[] {
    if (this.val === undefined) {
      return []
    }

    return this.val.split(separator).map((s) => s.trim())
  }
}

export const loadEnv = (
  key: string,
  required?: boolean,
  envFrom = process.env
) => {
  const val = envFrom[key]
  if (required && !val) {
    throw new Error(`env ${key} is required`)
  }
  return new EnvVal(val, key)
}
