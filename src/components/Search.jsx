import { useContext, useState, useEffect } from 'react'
import {
  collection,
  where,
  getDocs,
  query,
  setDoc,
  updateDoc,
  serverTimestamp,
  doc,
  getDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { AppContext } from '../state/AppContext'
import { ChatContext } from '../state/ChatContext'

const Search = () => {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  const { currentUser } = useContext(AppContext)
  const { dispatch } = useContext(ChatContext)

  useEffect(() => {
    if (!username) {
      setError(null)
    }
  }, [username])
  console.log(error)

  // const handleSearch = async () => {
  //   const q = query(
  //     collection(db, 'userFriends', currentUser.uid),
  //     where('friendName', '==', username)
  //   )
  //   try {
  //     const querySnapshot = await getDocs(q)
  //     if (querySnapshot.empty) {
  //       setError('Friend not found.')
  //     } else {
  //       querySnapshot.forEach((doc) => {
  //         setUser(doc.data())
  //       })
  //     }
  //   } catch (err) {
  //     setError(err)
  //   }
  // }

  const handleSearch = async () => {
    try {
      const userFriendsRef = collection(db, 'userFriends')
      const querySnapshot = await getDocs(userFriendsRef)
      let found = false

      querySnapshot.forEach((doc) => {
        const friends = doc.data()
        for (let friendId in friends) {
          if (friends[friendId].friendName === username) {
            setUser(friends[friendId])
            found = true
            break
          }
        }
      })

      if (!found) {
        setError('Friend not found.')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleKeyDown = (e) => {
    if (e.code === 'Enter') {
      handleSearch()
    }
  }

  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid
    try {
      const res = await getDoc(doc(db, 'chats', combinedId))

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, 'chats', combinedId), { messages: [] })

        //create user chats
        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [combinedId + '.userInfo']: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        })

        await updateDoc(doc(db, 'userChats', user.uid), {
          [combinedId + '.userInfo']: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        })
      }
    } catch (err) {
      setError(err)
    }
    dispatch({ type: 'CHANGE_USER', payload: user })
    setUser(null)
    setUsername('')
  }

  return (
    <div className=" border-b border-graydark">
      <div className="mb-1 flex flex-row items-center p-3 gap-2 pb-1">
        <i className="fas fa-search text-graymedium"></i>
        <input
          type="text"
          placeholder="find a friend"
          className=" bg-transparent outline-none text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {error && (
        <div className="  p-3 text-md text-red flex flex-row items-center gap-2 ">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
        </div>
      )}

      {user && (
        <div
          className={`p-3 flex flex-row items-center gap-2 cursor-pointer hover:bg-darksecondary ${
            user.uid === currentUser.uid && 'pointer-events-none'
          }`}
          onClick={handleSelect}>
          <img
            src={user.photoURL}
            className=" w-10 h-10 rounded-full object-cover"
          />
          <div>
            <span className="text-white">{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search
