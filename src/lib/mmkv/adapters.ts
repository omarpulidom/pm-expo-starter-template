import type { StateStorage } from 'zustand/middleware'
import { reactQueryStorage, storageMMKV } from './stores'
import type { JSONStorage } from './type'

export const clientStorage: JSONStorage = {
  setItem: (key, value) => {
    reactQueryStorage.set(key, value)
  },
  getItem: (key) => {
    const value = reactQueryStorage.getString(key)
    return value === undefined ? null : value
  },
  removeItem: (key) => {
    reactQueryStorage.delete(key)
  },
}

export const zustandMMKVStorage: StateStorage = {
  setItem: (name, value) => {
    return storageMMKV.set(name, value)
  },
  getItem: (name) => {
    const value = storageMMKV.getString(name)
    return value ?? null
  },
  removeItem: (name) => {
    return storageMMKV.delete(name)
  },
}
