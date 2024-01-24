import Message from './Message'
import { ChatContext } from '../state/ChatContext'
import { useContext, useState } from 'react'
import Scrollbar from './ui/Scrollbar'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { db } from '../firebase'
import { AppContext } from '../state/AppContext'

const Messages = () => {
  // const { currentUser } = useContext(AppContext)
  const { data } = useContext(ChatContext)
  const [messages, setMessages] = useState([])
  useEffect(() => {
    if (!data.chatId) {
      console.log('Chat ID is undefined')
      return
    }
    const unsub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
      if (doc.exists()) {
        doc.data().messages && setMessages(doc.data().messages)
      }
    })
    return () => unsub()
  }, [data.chatId])

  const bottomRef = useRef(null)

  useLayoutEffect(() => {
    bottomRef.current.scrollIntoView({
      behavior: 'smooth',
    })
  })

  return (
    <Scrollbar addClassName=" flex-grow bg-bgcolorlight ">
      <div className=" overflow-y-auto flex flex-col-reverse gap-4 p-3 pr-2.5">
        {messages
          .sort((a, b) => b.date - a.date)
          .map((message) => (
            <Message key={message.id} message={message} />
          ))}
      </div>

      <div ref={bottomRef} />
    </Scrollbar>
  )
}

export default Messages
