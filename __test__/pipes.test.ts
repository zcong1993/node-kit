import 'reflect-metadata'
import { Exclude, Expose, Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import {
  parseIntPipe,
  parseFloatPipe,
  parseBoolPipe,
  parseEnumPipe,
  PipeErrorFactory,
  validationPipe,
} from '../src/pipes'

class TestError extends Error {}

const testErrorFactory: PipeErrorFactory = (err) => new TestError(err)

describe('parseIntPipe', () => {
  it('should return number', () => {
    expect(parseIntPipe('13')).toBe(13)
  })

  it('should throw', () => {
    expect(() => parseIntPipe('13abc')).toThrow()
    expect(() => parseIntPipe('13abc', testErrorFactory)).toThrowError(
      TestError
    )
  })
})

describe('parseFloatPipe', () => {
  it('should return number', () => {
    expect(parseFloatPipe('13.33')).toBe(13.33)
  })

  it('should throw', () => {
    expect(() => parseFloatPipe('13.322abc')).toThrow()
    expect(() => parseFloatPipe('13.322abc', testErrorFactory)).toThrowError(
      TestError
    )
  })
})

describe('parseBoolPipe', () => {
  it('should return boolean', () => {
    expect(parseBoolPipe('true')).toBe(true)
    expect(parseBoolPipe(true)).toBe(true)
    expect(parseBoolPipe('false')).toBe(false)
    expect(parseBoolPipe(false)).toBe(false)
  })

  it('should throw', () => {
    expect(() => parseBoolPipe('13.322abc')).toThrow()
    expect(() => parseBoolPipe('13.322abc', testErrorFactory)).toThrowError(
      TestError
    )
  })
})

describe('parseEnumPipe', () => {
  enum Direction {
    Up = 'UP',
  }

  enum Test {
    A = 1,
  }

  it('should return boolean', () => {
    expect(parseEnumPipe(Direction, 'UP')).toBe(Direction.Up)
    expect(parseEnumPipe(Test, 1)).toBe(Test.A)
  })

  it('should throw', () => {
    expect(() => parseEnumPipe(Direction, '13.322abc')).toThrow()
    expect(() =>
      parseEnumPipe(Direction, '13.322abc', testErrorFactory)
    ).toThrowError(TestError)
  })
})

@Exclude()
class TestModelInternal {
  constructor() {}
  @Expose()
  @IsString()
  public prop1: string

  @Expose()
  @IsString()
  public prop2: string

  @Expose({ groups: ['internal'] })
  @IsString()
  @IsOptional()
  public propInternal: string
}

class TestModel {
  @IsString()
  public prop1: string

  @IsString()
  public prop2: string

  @IsOptional()
  @IsString()
  public optionalProp: string
}

describe('validationPipe', () => {
  describe('invalid args', () => {
    it('null or undefined as type or value', () => {
      expect(validationPipe(null, 'aaa')).toBe('aaa')
      expect(validationPipe(undefined, 'aaa')).toBe('aaa')
      expect(validationPipe(TestModel, null)).toBe(null)
      expect(validationPipe(TestModel, undefined)).toBe(undefined)
    })
  })

  describe('when validate pass', () => {
    test.each([
      [{ prop1: 'value1', prop2: 'value2' }],
      [
        {
          prop1: 'value1',
          prop2: 'value2',
          optionalProp: undefined,
        },
      ],
      [
        {
          prop1: 'value1',
          prop2: 'value2',
          optionalProp: null,
        },
      ],
      [
        {
          prop1: 'value1',
          prop2: 'value2',
          optionalProp: 'optional value',
        },
      ],
    ])('should return unchanged value %o', (value) => {
      expect(validationPipe(TestModel, value)).toBe(value)
      expect(validationPipe(TestModel, value)).not.toBeInstanceOf(TestModel)
    })
  })

  describe('when validation fails', () => {
    it('should throw an error', async () => {
      const testObj = { prop1: 'value1' }
      expect(() => validationPipe(TestModel, testObj)).toThrow()
    })

    it('custom exceptionFactory', async () => {
      const testObj = { prop1: 'value1' }
      expect(() =>
        validationPipe(TestModel, testObj, {
          exceptionFactory: () => new TestError(),
        })
      ).toThrowError(TestError)
    })

    class TestModel2 {
      @IsString()
      public prop1: string

      @IsBoolean()
      public prop2: string

      @IsOptional()
      @IsString()
      public optionalProp: string
    }
    class TestModelWithNested {
      @IsString()
      prop: string

      @IsDefined()
      @Type(() => TestModel2)
      @ValidateNested()
      test: TestModel2
    }
    it('should return string errors', async () => {
      const model = new TestModelWithNested()
      model.test = new TestModel2()

      try {
        validationPipe(TestModelWithNested, model)
      } catch (err) {
        expect(err.message).toMatchSnapshot()
      }
    })

    class TestModelForNestedArrayValidation {
      @IsString()
      public prop: string

      @IsArray()
      @ValidateNested()
      @Type(() => TestModel2)
      public test: TestModel2[]
    }
    it('should provide complete path for nested errors', async () => {
      const model = new TestModelForNestedArrayValidation()
      model.test = [new TestModel2()]

      try {
        validationPipe(TestModelForNestedArrayValidation, model)
      } catch (err) {
        expect(err.message).toMatchSnapshot()
      }
    })
  })

  describe('when validation transforms', () => {
    it('should return a TestModel instance', async () => {
      const testObj = { prop1: 'value1', prop2: 'value2', prop3: 'value3' }
      expect(
        validationPipe(TestModel, testObj, { transform: true })
      ).toBeInstanceOf(TestModel)
    })

    describe('when validation strips', () => {
      it('should return a TestModel without extra properties', async () => {
        const testObj = { prop1: 'value1', prop2: 'value2', prop3: 'value3' }
        expect(
          validationPipe(TestModel, testObj, {
            validatorOptions: { whitelist: true },
          })
        ).not.toBeInstanceOf(TestModel)
        expect(
          validationPipe(TestModel, testObj, {
            validatorOptions: { whitelist: true },
          })
        ).not.toHaveProperty('prop3')
      })
    })

    describe('when validation rejects', () => {
      it('should throw an error', () => {
        const testObj = { prop1: 'value1', prop2: 'value2', prop3: 'value3' }
        expect(() =>
          validationPipe(TestModel, testObj, {
            validatorOptions: { forbidNonWhitelisted: true, whitelist: true },
          })
        ).toThrow()
      })
    })

    describe('when transformation is internal', () => {
      it('should return a TestModel with internal property', async () => {
        const testObj = {
          prop1: 'value1',
          prop2: 'value2',
          propInternal: 'value3',
        }
        expect(
          validationPipe(TestModelInternal, testObj, {
            transform: true,
            transformOptions: { groups: ['internal'] },
          })
        ).toHaveProperty('propInternal')
      })
    })

    describe('when transformation is external', () => {
      it('should return a TestModel without internal property', async () => {
        const testObj = {
          prop1: 'value1',
          prop2: 'value2',
          propInternal: 'value3',
        }
        expect(
          validationPipe(TestModelInternal, testObj, {
            transform: true,
            transformOptions: { groups: ['external'] },
          })
        ).not.toHaveProperty('propInternal')
      })
    })
  })
})
