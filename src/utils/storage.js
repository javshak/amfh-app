// Storage abstraction — swap localStorage for IndexedDB later without touching route code

const PREFIX = 'amfh_'

export const storage = {
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
      return true
    } catch (e) {
      console.error('Storage write failed:', e)
      return false
    }
  },

  get(key) {
    try {
      const val = localStorage.getItem(PREFIX + key)
      return val ? JSON.parse(val) : null
    } catch (e) {
      console.error('Storage read failed:', e)
      return null
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key)
      return true
    } catch (e) {
      return false
    }
  },

  keys() {
    return Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .map(k => k.slice(PREFIX.length))
  },
}
