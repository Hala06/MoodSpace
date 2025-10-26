const CHECKIN_STORAGE_KEY = 'moodspace_checkins'

const loadStore = () => {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(CHECKIN_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return { __legacy__: parsed }
    }
    if (parsed && typeof parsed === 'object') {
      return parsed
    }
    return {}
  } catch (error) {
    console.error('Failed to read stored check-ins', error)
    return {}
  }
}

const writeStore = (store) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CHECKIN_STORAGE_KEY, JSON.stringify(store))
  } catch (error) {
    console.error('Failed to write stored check-ins', error)
  }
}

const loadCheckins = (userId) => {
  const store = loadStore()
  if (!userId) {
    return Array.isArray(store.__legacy__) ? store.__legacy__ : []
  }
  return Array.isArray(store[userId]) ? store[userId] : []
}

const persistCheckins = (userId, entries) => {
  if (!userId || !Array.isArray(entries)) return
  const store = loadStore()
  store[userId] = entries
  if (store.__legacy__) {
    delete store.__legacy__
  }
  writeStore(store)
}

const clearCheckins = (userId) => {
  if (typeof window === 'undefined') return
  if (!userId) {
    window.localStorage.removeItem(CHECKIN_STORAGE_KEY)
    return
  }
  const store = loadStore()
  if (store[userId]) {
    delete store[userId]
    const remainingKeys = Object.keys(store).filter((key) => key !== '__legacy__' && store[key])
    if (remainingKeys.length === 0) {
      window.localStorage.removeItem(CHECKIN_STORAGE_KEY)
    } else {
      writeStore(store)
    }
  }
}

export { CHECKIN_STORAGE_KEY, loadCheckins, persistCheckins, clearCheckins }
