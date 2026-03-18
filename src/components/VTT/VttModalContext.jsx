import { createContext, useContext, useState } from 'react'

const VttModalContext = createContext(null)

export function VttModalProvider({ children }) {
  const [modal, setModal] = useState(null) // null | 'characters' | { type: 'charsheet', characterId }

  const openCharacters = () => setModal('characters')
  const openCharSheet = (characterId) => setModal({ type: 'charsheet', characterId })
  const openPage = (page) => setModal({ type: 'page', page })
  const closeModal = () => setModal(null)

  return (
    <VttModalContext.Provider value={{ modal, openCharacters, openCharSheet, openPage, closeModal }}>
      {children}
    </VttModalContext.Provider>
  )
}

export function useVttModal() {
  return useContext(VttModalContext)
}
