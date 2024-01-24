import Messages from './Messages'
import Input from './Input'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../state/AppContext'
import { ChatContext } from '../state/ChatContext'
import { db } from '../firebase'
import AddFriend from './AddFriend'
import { doc, onSnapshot } from 'firebase/firestore'
import Notifications from './Notifications'

const Chat = () => {
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState([])
  const [readNotifications, setReadNotifications] = useState([])
  const [notifications, setNotifications] = useState([])
  const { setIsSidebarOpen } = useContext(AppContext)
  const { currentUser } = useContext(AppContext)
  const { data } = useContext(ChatContext)

  const handleAddFriend = () => {
    setIsAddFriendOpen(true)
  }

  useEffect(() => {
    if (!currentUser.uid) return
    const getChats = () => {
      const unsubscribe = onSnapshot(
        doc(db, 'notifications', currentUser.uid),
        (doc) => {
          setNotifications(doc.data().messages)
        }
      )
      return () => {
        unsubscribe()
      }
    }
    currentUser.uid && getChats()
  }, [currentUser.uid]) // eslint-disable-line react-hooks/exhaustive-deps

  // useEffect(() => {
  //   console.log('Notification open state:', isNotificationOpen)
  // }, [isNotificationOpen])

  useEffect(() => {
    const unread = notifications.filter(
      (notification) => notification.readStatus === 'unread'
    )
    setUnreadNotifications(unread)
    const read = notifications.filter(
      (notification) => notification.readStatus === 'read'
    )
    setReadNotifications(read)
  }, [notifications])

  const handleNotification = () => {
    setIsNotificationOpen(true)
  }
  const handleMousedown = (e) => {
    setIsAddFriendOpen(false)
    setIsNotificationOpen(false)
  }

  return (
    <div
      className="  w-full rounded-r-lg flex flex-col min-w-96"
      onMouseDown={handleMousedown}>
      <div className=" bg-secondary p-6 h-14 rounded-t-lg flex flex-row justify-between items-center md:rounded-none md:rounded-se-lg">
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className=" flex items-center gap-2">
          <i
            className="fas fa-bars text-graymedium md:hidden cursor-pointer"
            onClick={() => setIsSidebarOpen((prev) => !prev)}></i>
          <span className=" text-graymedium text-base">
            {data.user?.displayName}
          </span>
        </div>
        <div className="flex flex-row items-center gap-3">
          <div className="relative">
            <i
              className="fas fa-user-plus text-graymedium cursor-pointer"
              onClick={handleAddFriend}
            />
            {isAddFriendOpen && <AddFriend setShowModal={setIsAddFriendOpen} />}
          </div>
          <div className=" relative" onClick={handleNotification}>
            <i className="fas fa-bell text-graymedium cursor-pointer" />
            {unreadNotifications.length > 0 && (
              <div className="absolute top-0 -right-1.5 text-white bg-red w-3 h-3 rounded-full flex items-center justify-center text-[9px] ">
                {unreadNotifications.length}
              </div>
            )}
            {isNotificationOpen && (
              <Notifications
                setIsNotificationOpen={setIsNotificationOpen}
                unreadNotifications={unreadNotifications}
                readNotifications={readNotifications}
              />
            )}
          </div>
          <i className="fas fa-ellipsis-h text-graymedium cursor-pointer" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  )
}

export default Chat
