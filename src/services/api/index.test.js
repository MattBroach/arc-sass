import api, { parseJSON, parseSettings, parseEndpoint } from '.'

jest.mock('config', () => ({
  apiUrl: 'https://api.foo.com',
}))

describe('parseJSON', () => {
  it('calls response.json', () => {
    const response = {
      json: jest.fn(() => Promise.resolve({ test: 'data' })),
      status: 200,
      ok: true,
    }
    expect(parseJSON(response)).resolves.toEqual({
      json: { test: 'data' },
      status: 200,
      ok: true,
    })
  })
})

describe('parseSettings', () => {
  it('has method get by default', () => {
    expect(parseSettings().method).toBe('get')
  })

  it('has normal body', () => {
    expect(parseSettings({ body: 'foo' }).body).toBe('foo')
  })

  it('has data body', () => {
    expect(parseSettings({ data: { foo: 'bar' } }).body)
      .toBe(JSON.stringify({ foo: 'bar' }))
  })

  it('has passed method', () => {
    expect(parseSettings({ method: 'post' }).method).toBe('post')
  })

  it('merges headers', () => {
    const otherSettings = { headers: { foo: 'bar' } }
    const settings = parseSettings(otherSettings)
    expect(settings).toHaveProperty('headers.foo', 'bar')
    expect(Object.keys(settings.headers).length)
      .toBeGreaterThan(Object.keys(otherSettings.headers).length)
  })
})

describe('parseEndpoint', () => {
  it('appends endpoint to apiUrl', () => {
    expect(parseEndpoint('/foo')).toBe('https://api.foo.com/foo')
  })

  it('parses params', () => {
    expect(parseEndpoint('/foo', { bar: 'baz' })).toBe('https://api.foo.com/foo?bar=baz')
  })

  it('parses url other than apiUrl', () => {
    expect(parseEndpoint('https://foo.bar/baz')).toBe('https://foo.bar/baz')
  })
})

describe('api', () => {
  describe('request', () => {
    it('passes the proper arguments to fetch', () => {
      global.fetch = jest.fn(() => Promise.resolve({
        ok: true,
        json: jest.fn(() => Promise.resolve({ test: 'data' })),
      }))

      expect(global.fetch).not.toBeCalled()
      api.request('/foo').then(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.foo.com/foo',
          expect.objectContaining({
            method: 'get',
          })
        )
      })
    })

    it('returns the json error when response is not ok', () => {
      global.fetch = jest.fn(() => Promise.resolve({
        ok: false,
        json: jest.fn(() => Promise.resolve({ field: 'error' })),
      }))

      expect(api.request('/foo')).rejects.toEqual({ field: 'error' })
    })

    it('raises the server error on fetch fail', () => {
      global.fetch = jest.fn(() => Promise.reject())

      expect(api.request('/foo')).rejects.toEqual({
        _error: ['Can\'t connect to the server. Please try again later'],
      })
    })
  })

  ;['delete', 'get', 'post', 'put', 'patch'].forEach((method) => {
    test(method, () => {
      global.fetch = jest.fn(() => Promise.resolve({
        ok: true,
        json: jest.fn(() => Promise.resolve({ test: 'data' })),
      }))

      expect(global.fetch).not.toBeCalled()
      api[method]('/foo').then(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.foo.com/foo',
          expect.objectContaining({ method })
        )
      })
    })
  })

  describe('create', () => {
    beforeEach(() => {
      api.request = jest.fn()
    })

    it('creates without arguments', () => {
      api.create()
    })

    it('has settings', () => {
      expect(api.create({ foo: 'bar' }).settings).toEqual({ foo: 'bar' })
    })

    test('setToken', () => {
      const obj = api.create({ headers: { foo: 'bar' } })
      obj.setToken('token')
      expect(obj.settings).toEqual({
        headers: {
          foo: 'bar',
          Authorization: 'Bearer token',
        },
      })
    })

    test('unsetToken', () => {
      const obj = api.create({
        headers: {
          foo: 'bar',
          Authorization: 'Bearer token',
        },
      })
      obj.unsetToken()
      expect(obj.settings).toEqual({ headers: { foo: 'bar' } })
    })

    test('request', () => {
      const obj = api.create({ foo: 'bar' })
      expect(api.request).not.toBeCalled()
      obj.request('/foo', { baz: 'qux' })
      expect(api.request).toHaveBeenCalledWith('/foo', {
        foo: 'bar',
        baz: 'qux',
      })
    })

    ;['get', 'delete'].forEach((method) => {
      test(method, () => {
        const obj = api.create({ foo: 'bar' })
        expect(api.request).not.toBeCalled()
        obj[method]('/foo', { baz: 'qux' })
        expect(api.request).toHaveBeenCalledWith('/foo', {
          foo: 'bar',
          baz: 'qux',
          method,
        })
      })
    })

    ;['post', 'put', 'patch'].forEach((method) => {
      test(method, () => {
        const obj = api.create({ foo: 'bar' })
        expect(api.request).not.toBeCalled()
        obj[method]('/foo', { field: 'value' }, { baz: 'qux' })
        expect(api.request).toHaveBeenCalledWith('/foo', {
          foo: 'bar',
          baz: 'qux',
          data: {
            field: 'value',
          },
          method,
        })
      })
    })
  })
})
