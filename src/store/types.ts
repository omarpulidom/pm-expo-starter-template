import type { StateCreator } from 'zustand'
import type { AuthSlice } from './auth.store'

export type GlobalStoreType = {
  auth: AuthSlice
}

export type GlobalTypedStateCreator<T> = StateCreator<
  GlobalStoreType, // The global state type
  [], // Any middleware that mutates the global store's set/get
  [], // Any middleware that mutates the slice's set/get
  T // The type of the slice being created
>
