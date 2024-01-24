import { useState, useContext } from 'react'
import AppModal from './ui/AppModel'
import { AppContext } from '../state/AppContext'
import {
  Timestamp,
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'
import { v4 as uuid } from 'uuid'

//eslint-disable-next-line
const AddFriend = ({ setShowModal }) => {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  // const [isRequestSent, setIsRequestSent] = useState(false)
  const { currentUser } = useContext(AppContext)

  const handleSearch = async () => {
    const q = query(
      collection(db, 'users'),
      where('displayName', '==', username)
    )
    try {
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        setUser(doc.data())
      })
    } catch (err) {
      setError(err)
    }
  }

  const handleKeyDown = (e) => {
    if (e.code === 'Enter') {
      handleSearch()
    }
  }

  const handleAddFriend = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'notifications', user.uid))

      if (docSnap.exists()) {
        const messages = docSnap.data().messages || []
        const hasPendingRequest = messages.some(
          (message) =>
            message.senderId === currentUser.uid &&
            message.requestStatus === 'pending'
        )

        if (hasPendingRequest) {
          setError('You have already sent a friend request to this user.')
          return
        }
      }

      // 创建一个新的好友请求
      await updateDoc(doc(db, 'notifications', user.uid), {
        messages: arrayUnion({
          id: uuid(),
          text: `you received a friend request from ${currentUser.displayName}`,
          senderId: currentUser.uid,
          senderName: currentUser.displayName,
          senderImg: currentUser.photoURL,
          messageType: 'friendRequest',
          requestStatus: 'pending', // 'pending', 'accepted', 'rejected'
          readStatus: 'unread',
          date: Timestamp.now(),
        }),
      })

      // 更新UI，告知用户请求已发送
      setError(null)
      setShowModal(false)
      alert('Friend request sent!')
    } catch (err) {
      setError(err.message)
    }
  }
  return (
    // <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
    <div
      className="border-0 rounded-lg shadow-lg absolute flex flex-col p-3 top-6 right-1 bg-white outline-none focus:outline-none"
      onMouseDown={(e) => e.stopPropagation()}>
      {/*close modal icon*/}
      {/* <i
        className="fas fa-times absolute top-1 right-3 text-gray cursor-pointer text-2xl flex justify-end hover:text-graydark"
        onClick={() => setShowModal(false)}></i> */}
      <div className=" font-bold text-center">Search User</div>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Input username"
          className=" bg-transparent outline-none border-b pl-2 pt-6"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {user && (
        <>
          <div
            className={` flex flex-row items-center justify-between gap-2 pt-3 ${
              user.uid === currentUser.uid && 'pointer-events-none'
            }`}>
            <div className=" flex flex-row items-center gap-1">
              <img
                src={user.photoURL}
                className=" w-10 h-10 rounded-full object-cover"
              />
              <div>{user.displayName}</div>
            </div>
            <button
              className="mr-6 px-3 py-2 bg-secondary text-white rounded-lg"
              onClick={handleAddFriend}>
              Add
            </button>
          </div>

          {error && <div className=" text-red text-sm pt-3">{error}</div>}
        </>
      )}
    </div>
    // </div>
    // </AppModal>
  )
}

export default AddFriend
