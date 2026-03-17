// import {MMKV} from 'react-native-mmkv'

import { MMKV } from 'react-native-mmkv'
import { StateStorage } from 'zustand/middleware'

export const storage = new MMKV({
    id: 'storage',
    encryptionKey: 'my-super-secret-key',
})
export const tokenStorage = new MMKV({
    id: 'tokenStorage',
    encryptionKey: 'my-super-secret-key',
})

export const mmkvStorage: StateStorage = {
    setItem: (key: string, value: string) => {
        storage.set(key, value)
    },
    getItem: (key: string) => {
        const value = storage.getString(key)
        return value ? value : null
    },
    removeItem: (key: string) => {
        storage.delete(key)
    },
}