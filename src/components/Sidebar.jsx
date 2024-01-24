import Navbar from './Navbar'
import Search from './Search'
import Chats from './Chats'
import { useContext, useEffect } from 'react'
import { AppContext } from '../state/AppContext'

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useContext(AppContext)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isSidebarOpen) {
        setIsSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isSidebarOpen, setIsSidebarOpen])

  return (
    <div
      className={` w-3/5 max-w-56 bg-secondary rounded-l-lg overflow-hidden  ${
        isSidebarOpen ? 'block absolute h-4/5' : 'hidden md:block'
      } `}
      onMouseDown={(e) => e.stopPropagation()}>
      <Navbar />
      {/* <Search /> */}
      <Chats />
    </div>
  )
}

export default Sidebar
