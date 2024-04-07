import { MMKV } from "react-native-mmkv";

export const storage = new MMKV({
    id: 'wibulib'
})

const library = storage.getString('library')
if (!library) {
    storage.set('library', JSON.stringify({ 0: { name: 'default', items: {} } }))
}