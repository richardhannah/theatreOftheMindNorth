import { createContext, useContext, useState, useRef, useCallback } from 'react'

const VttModalContext = createContext(null)

export function VttModalProvider({ children }) {
  const [modal, setModal] = useState(null)
  const disconnectRef = useRef(null)

  const openCharacters = () => setModal('characters')
  const openCharSheet = (characterId) => setModal({ type: 'charsheet', characterId })
  const openPage = (page) => setModal({ type: 'page', page })
  const closeModal = () => setModal(null)

  const registerDisconnect = useCallback((fn) => { disconnectRef.current = fn }, [])
  const disconnect = useCallback(() => { disconnectRef.current?.() }, [])

  return (
    <VttModalContext.Provider value={{ modal, openCharacters, openCharSheet, openPage, closeModal, registerDisconnect, disconnect }}>
      {children}
    </VttModalContext.Provider>
  )
}

export function useVttModal() {
  return useContext(VttModalContext)
}
