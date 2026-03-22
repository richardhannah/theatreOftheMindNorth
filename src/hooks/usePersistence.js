import { useState, useEffect, useRef, useCallback } from 'react'

const DEFAULT_SYNC_INTERVAL = 10000

/**
 * Generic persistence hook — localStorage + periodic backend sync.
 *
 * @param {object} options
 * @param {string} options.storageKey - localStorage key
 * @param {*} options.defaultValue - initial value if nothing in localStorage or backend
 * @param {function} [options.loadFromApi] - async (headers) => data | null — fetch from backend
 * @param {function} [options.saveToApi] - async (data, headers) => void — push to backend
 * @param {number} [options.syncInterval] - ms between sync attempts (default 10000)
 * @param {string} [options.token] - auth token for API calls
 * @param {function} [options.onSaveStatus] - callback for save status ('Saved' | 'Sync error' | '')
 *
 * @returns {{ data, setData, loaded, markDirty }}
 */
export function usePersistence({
  storageKey,
  defaultValue,
  loadFromApi,
  saveToApi,
  syncInterval = DEFAULT_SYNC_INTERVAL,
  token,
  onSaveStatus,
}) {
  // Load from localStorage or use default
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) return JSON.parse(saved)
    } catch { /* ignore corrupt data */ }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const [loaded, setLoaded] = useState(false)
  const dirtyRef = useRef(false)
  const dataRef = useRef(data)
  const isFirstRender = useRef(true)

  // Keep ref in sync
  useEffect(() => {
    dataRef.current = data
  }, [data])

  // Build auth headers
  const headers = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }), [token])

  // Load from backend on mount
  useEffect(() => {
    if (!token || !loadFromApi) {
      setLoaded(true)
      return
    }
    loadFromApi(headers())
      .then((apiData) => {
        if (apiData != null) {
          setData(apiData)
        }
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  // Save to localStorage on every change (skip initial load)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    localStorage.setItem(storageKey, JSON.stringify(data))
    dirtyRef.current = true
  }, [data, storageKey])

  // Mark dirty externally (e.g. when sub-state changes that aren't in data)
  const markDirty = useCallback(() => {
    dirtyRef.current = true
  }, [])

  // Periodic sync to backend
  useEffect(() => {
    if (!token || !saveToApi) return

    const interval = setInterval(async () => {
      if (!dirtyRef.current) return
      dirtyRef.current = false

      try {
        await saveToApi(dataRef.current, headers())
        onSaveStatus?.('Saved')
        setTimeout(() => onSaveStatus?.(''), 2000)
      } catch {
        dirtyRef.current = true // retry next interval
        onSaveStatus?.('Sync error')
        setTimeout(() => onSaveStatus?.(''), 3000)
      }
    }, syncInterval)

    return () => clearInterval(interval)
  }, [token, saveToApi, headers, syncInterval, onSaveStatus])

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (!dirtyRef.current || !token || !saveToApi) return
      // Best-effort sync on unmount — can't await
      try {
        saveToApi(dataRef.current, headers())
      } catch { /* ignore */ }
    }
  }, [token, saveToApi, headers])

  return { data, setData, loaded, markDirty }
}
