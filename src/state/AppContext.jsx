import { createContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

export const AppContext = createContext()

// eslint-disable-next-line react/prop-types
export const AppContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({})
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setCurrentUser(currentUser)
    })
    return () => unsub()
  }, [])

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isDropdownOpen,
        setIsDropdownOpen,
        isSidebarOpen,
        setIsSidebarOpen,
      }}>
      {children}
    </AppContext.Provider>
  )
}
