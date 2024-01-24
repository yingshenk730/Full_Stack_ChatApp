import { useContext } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { AppContext } from '../state/AppContext'
import { ChatContext } from '../state/ChatContext'

const Navbar = () => {
  const { currentUser, isDropdownOpen, setIsDropdownOpen } =
    useContext(AppContext)

  const { dispatch } = useContext(ChatContext)

  const handleLogout = async () => {
    signOut(auth)
    setIsDropdownOpen(false)
    dispatch({ type: 'CHANGE_USER', payload: {} })
  }
  return (
    <div className=" bg-darksecondary relative p-2 flex flex-row h-14 items-center justify-center lg:justify-between text-xs text-white">
      <span className=" font-bold text-base hidden lg:block">
        Let&apos;s Chat
      </span>
      <div onMouseDown={(e) => e.stopPropagation()}>
        <div
          className="flex flex-row gap-2 justify-between items-center cursor-pointer"
          onClick={(e) => {
            setIsDropdownOpen((prev) => !prev)
          }}>
          <img
            src={currentUser.photoURL || '/img/img.png'}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-base">{currentUser.displayName}</span>

          <i className="fas fa-angle-down"></i>
        </div>
      </div>

      {isDropdownOpen && (
        <div
          className="absolute top-12 right-2  bg-darksecondary "
          onMouseDown={(e) => e.stopPropagation()}>
          <button className="text-base  p-3" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default Navbar
