import axios from 'axios'
import {
  AuthHeaders,
  AuthResponse,
  SingleLayerStringMap,
} from '../types'
import {
  deleteAuthHeaders,
  getUserAttributesFromResponse,
  persistAuthHeadersInDeviceStorage,
  setAuthHeaders,
} from './auth'
import AsyncLocalStorage from '../AsyncLocalStorage'

describe('auth service', () => {
  const headers: AuthHeaders = {
    'access-token': 'accessToken',
    'token-type': 'tokenType',
    'client': 'client',
    'expiry': 'expiry',
    'uid': 'uid',
  }

  describe('setAuthHeaders', () => {
    it('sets the appropriate auth headers on the global axios config', async () => {
      await setAuthHeaders(AsyncLocalStorage, headers)
      Object.keys(headers).forEach((key: string) => {
        expect(axios.defaults.headers.common[key]).toBe(headers[key])
      })
    })
  })

  describe('persistAuthHeadersInDeviceStorage', () => {
    it('persists the appropriate auth headers in device storage', async () => {
      await persistAuthHeadersInDeviceStorage(AsyncLocalStorage, headers)
      Object.keys(headers).forEach((key: string) => {
        expect(localStorage.getItem(key)).toBe(headers[key])
      })
    })

    it('keeps old auth headers in device storage if new ones are empty', async () => {
      await persistAuthHeadersInDeviceStorage(AsyncLocalStorage, headers)

      expect(localStorage.getItem('access-token')).toBe(headers['access-token'])

      const emptyHeaders: AuthHeaders = {
        'access-token': '',
        'token-type': 'tokenType',
        'client': 'client',
        'expiry': 'expiry',
        'uid': 'uid',
      }

      await persistAuthHeadersInDeviceStorage(AsyncLocalStorage, emptyHeaders)

      expect(localStorage.getItem('access-token')).toBe(headers['access-token'])
  })

  describe('deleteAuthHeadersFromDeviceStorage', () => {
    it('deletes the appropriate auth headers from the global axios config', () => {
      deleteAuthHeaders()
      Object.keys(headers).forEach((key: string) => {
        expect(axios.defaults.headers.common['access-token']).toBeUndefined()
      })
    })
  })

  describe('getUserAttributesFromResponse', () => {
    it('gets the values of the user attributes from the response, accounting for casing differences', () => {
      const userAttributes: SingleLayerStringMap = {
        firstName: 'first_name',
        lastName: 'last_name',
      }
      const authResponse: AuthResponse = {
        headers,
        data: {
          data: {
            first_name: 'Rick',
            last_name: 'Sanchez',
          },
        },
      }
      const result: SingleLayerStringMap = getUserAttributesFromResponse(userAttributes, authResponse)
      const expectedResult: SingleLayerStringMap = {
        firstName: 'Rick',
        lastName: 'Sanchez',
      }
      expect(result).toEqual(expectedResult)
    })
  })
})
