import Img from '../img/img.png'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase'
import { useState, useContext } from 'react'
import { AppContext } from '../state/AppContext'
import { ChatContext } from '../state/ChatContext'
import { v4 as uuid } from 'uuid'
import { Timestamp, arrayUnion, updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'

const Input = () => {
  const [text, setText] = useState('')
  const [img, setImg] = useState(null)

  const { currentUser } = useContext(AppContext)
  const { data } = useContext(ChatContext)

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid())
      const uploadTask = uploadBytesResumable(storageRef, img)
      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, 'chats', data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: text,
                sender: currentUser.uid,
                img: downloadURL,
                date: Timestamp.now(),
              }),
            })
          })
        }
      )
    } else {
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: text,
          sender: currentUser.uid,
          date: Timestamp.now(),
        }),
      })
    }

    await updateDoc(doc(db, 'userFriends', currentUser.uid), {
      [data.user.uid + '.lastMessage']: {
        text,
      },
    })

    await updateDoc(doc(db, 'userFriends', data.user.uid), {
      [currentUser.uid + '.lastMessage']: {
        text,
      },
    })
    setText('')
    setImg(null)
  }

  const handleKeyDown = (e) => {
    if (e.code === 'Enter') {
      handleSend()
    }
  }

  return (
    <div className=" sm:min-h-16 bg-white md:rounded-none md:rounded-ee-lg rounded-b-lg   flex flex-col sm:flex-row items-center justify-between  gap-3 p-3">
      <input
        type="text"
        placeholder="typing something here"
        className="outline-none p-2 w-full sm:flex-grow sm:border-none border-b border-graymedium"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className=" flex gap-2 w-full sm:min-w-36 items-center justify-end">
        <input
          type="file"
          id="file"
          className=" hidden"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" className="w-6 h-6" />
        </label>
        <button
          className=" bg-secondary text-white p-1 px-3"
          onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  )
}

export default Input
