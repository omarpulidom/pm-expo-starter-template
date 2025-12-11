import { MMKV } from 'react-native-mmkv'

const MAIN_STORE_ID = 'main-store-id'
const ENCRYPTION_KEY = 'encryption-key'

const storageMMKV = new MMKV({
  id: MAIN_STORE_ID,
  encryptionKey: ENCRYPTION_KEY,
})

const REACT_QUERY_STORAGE_ID = 'react-query-storage-id'
const REACT_QUERY_ENCRYPTION_KEY = 'react-query-encryption-key'

const reactQueryStorage = new MMKV({
  id: REACT_QUERY_STORAGE_ID,
  encryptionKey: REACT_QUERY_ENCRYPTION_KEY,
})

function WARNING_CLEAR_ALL_MMKVS_INSTANCES() {
  console.log('Clearing all MMKV instances...')

  try {
    storageMMKV.clearAll()
    console.log('Main storage cleared')
  } catch (error) {
    console.error('Error clearing main storage:', error)
  }

  try {
    reactQueryStorage.clearAll()
    console.log('React Query storage cleared')
  } catch (error) {
    console.error('Error clearing React Query storage:', error)
  }
}

export { storageMMKV, reactQueryStorage, WARNING_CLEAR_ALL_MMKVS_INSTANCES }
