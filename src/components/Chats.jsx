import { useEffect, useState, useContext } from 'react'
import { db } from '../firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { AppContext } from '../state/AppContext'
import { ChatContext } from '../state/ChatContext'

const Chats = () => {
  const [chats, setChats] = useState([])
  const { currentUser } = useContext(AppContext)
  const { dispatch } = useContext(ChatContext)

  useEffect(() => {
    if (!currentUser.uid) return
    const getChats = () => {
      const unsubscribe = onSnapshot(
        doc(db, 'userFriends', currentUser.uid),
        (doc) => {
          setChats(doc.data())
        }
      )
      return () => {
        unsubscribe()
      }
    }
    currentUser.uid && getChats()
  }, [currentUser.uid])

  const handleUserSelect = (user) => {
    dispatch({ type: 'CHANGE_USER', payload: user })
  }
  // console.log(Object.entries(chats))

  return (
    <>
      {Object.entries(chats)
        .sort((a, b) => b[1].date - a[1].date)
        .filter((chat) => chat[1].friendId !== currentUser.uid)
        .map((chat) => (
          <div
            key={chat[0]}
            className="p-3 flex flex-row items-center gap-2 cursor-pointer hover:bg-darksecondary"
            onClick={() =>
              handleUserSelect({
                uid: chat[1].friendId,
                photoURL: chat[1].friendImg,
                displayName: chat[1].friendName,
              })
            }>
            <img
              src={chat[1].friendImg}
              alt=""
              className=" w-10 h-10 rounded-full object-cover"
            />
            <div>
              <span className="text-white">{chat[1].friendName}</span>
              <p className=" text-xs text-graymedium">
                {chat[1].lastMessage?.text}
              </p>
            </div>
          </div>
        ))}
    </>
  )
}

export default Chats
