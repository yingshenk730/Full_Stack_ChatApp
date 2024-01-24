import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
import { useEffect, useState, useContext } from 'react'
import { AppContext } from '../state/AppContext'

const Home = () => {
  const { setIsSidebarOpen, setIsDropdownOpen } = useContext(AppContext)

  const handleMouseDown = () => {
    setIsDropdownOpen(false)
    setIsSidebarOpen(false)
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      className=" bg-bgcolor w-screen h-screen flex items-center justify-center overflow-x-auto">
      <div className=" shadow-xl w-2/3 h-4/5 max-w-3xl rounded-lg flex">
        <Sidebar />
        <Chat />
      </div>
    </div>
  )
}

export default Home
