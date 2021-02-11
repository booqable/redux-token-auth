import axios from 'axios'
import { invertMapKeysAndValues } from './utility'
import {
  AuthHeaders,
  AuthResponse,
  DeviceStorage,
  SingleLayerStringMap,
} from '../types'

const authHeaderKeys: Array<string> = [
  'access-token',
  'token-type',
  'client',
  'expiry',
  'uid',
]

export const setAuthHeaders = (Storage: DeviceStorage, headers?: AuthHeaders): Promise<void> => {
  const promises: Promise<any>[] = []

  authHeaderKeys.forEach((key: string) => {
    const promise = Storage.getItem(key).then((fromStorage: string) => {
      const value = (headers && headers[key]) || fromStorage
      axios.defaults.headers.common[key] = value
    })

    promises.push(promise)
  })

  return Promise.all(promises).then(() => {})
}

export const persistAuthHeadersInDeviceStorage = (Storage: DeviceStorage, headers: AuthHeaders): Promise<void> => {
  const promises: Promise<any>[] = []

  authHeaderKeys.forEach((key: string) => {
    const promise = Storage.getItem(key).then((fromStorage: string) => {
      const value = headers[key] || fromStorage
      return Storage.setItem(key, value) // <--- Not really needed
    })

    promises.push(promise)
  })

  return Promise.all(promises).then(() => {})
}

export const deleteAuthHeaders = (): void => {
  authHeaderKeys.forEach((key: string) => {
    delete axios.defaults.headers.common[key]
  })
}

export const deleteAuthHeadersFromDeviceStorage = (Storage: DeviceStorage): Promise<void> => {
  const promises: Promise<any>[] = []

  authHeaderKeys.forEach((key: string) => {
    const promise = Storage.removeItem(key)

    promises.push(promise)
  })

  return Promise.all(promises).then(() => {})
}

export const getUserAttributesFromResponse = (
  userAttributes: SingleLayerStringMap,
  response: AuthResponse
): SingleLayerStringMap => {
  const invertedUserAttributes: SingleLayerStringMap = invertMapKeysAndValues(userAttributes)
  const userAttributesBackendKeys: string[] = Object.keys(invertedUserAttributes)
  const userAttributesToReturn: SingleLayerStringMap = {}
  Object.keys(response.data.data).forEach((key: string) => {
    if (userAttributesBackendKeys.indexOf(key) !== -1) {
      userAttributesToReturn[invertedUserAttributes[key]] = response.data.data[key]
    }
  })
  return userAttributesToReturn
}
