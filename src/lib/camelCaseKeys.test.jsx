import camelCaseKeys from './camelCaseKeys'

describe('camelCaseKeys', () => {
  it('should return camel case keys for an object', () => {
    const input = {
      Email: 'email',
      Password: 'password',
      PascalCase: 'pascalCase',
    }

    const expected = {
      email: 'email',
      password: 'password',
      pascalCase: 'pascalCase',
    }

    expect(camelCaseKeys(input)).toEqual(expected)
  })

  it('should return camel case keys for each object in an array', () => {
    const input = [
      {
        Email: 'email',
        Password: 'password',
        PascalCase: 'pascalCase',
      },
      {
        Email2: 'email',
        Password2: 'password',
        PascalCase2: 'pascalCase',
      },
    ]

    const expected = [
      {
        email: 'email',
        password: 'password',
        pascalCase: 'pascalCase',
      },
      {
        email2: 'email',
        password2: 'password',
        pascalCase2: 'pascalCase',
      },
    ]

    expect(camelCaseKeys(input)).toEqual(expected)
  })

  it('should return input if string', () => {
    const input = 'string'

    expect(camelCaseKeys(input)).toEqual(input)
  })
})
