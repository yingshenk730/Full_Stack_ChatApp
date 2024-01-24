import {
  Timestamp,
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import React, { useContext, useState } from 'react'
import { db } from '../../firebase'
import { AppContext } from '../../state/AppContext'
import { v4 as uuid } from 'uuid'

//eslint-disable-next-line
const Notification = ({ notification, setIsNotificationOpen }) => {
  const [error, setError] = useState(null)
  const { currentUser } = useContext(AppContext)

  const handleNotificationRequest = async (
    response,
    userId,
    userName,
    userImg
  ) => {
    try {
      if (response === 'accepted') {
        await updateDoc(doc(db, 'userFriends', currentUser.uid), {
          [userId]: {
            date: serverTimestamp(),
            friendId: userId,
            friendName: userName,
            friendImg: userImg,
          },
        })

        await updateDoc(doc(db, 'userFriends', userId), {
          [currentUser.uid]: {
            date: serverTimestamp(),
            friendId: currentUser.uid,
            friendName: currentUser.displayName,
            friendImg: currentUser.photoURL,
          },
        })

        const combinedId =
          currentUser.uid > userId
            ? currentUser.uid + userId
            : userId + currentUser.uid

        await setDoc(doc(db, 'chats', combinedId), { messages: [] })
      }

      // Step 1: Retrieve the current messages
      const notificationsRef = doc(db, 'notifications', currentUser.uid)
      const docSnap = await getDoc(notificationsRef)

      if (docSnap.exists()) {
        let messages = docSnap.data().messages || []
        // console.log(messages)

        // Step 2: Find the specific message and update it
        messages = messages.map((message) => {
          if (message.senderId !== userId) return message

          if (
            response === 'read' &&
            message.messageType === 'notification' &&
            message.readStatus === 'unread'
          ) {
            return { ...message, readStatus: 'read', date: Timestamp.now() }
          }

          if (
            response !== 'read' &&
            message.messageType === 'friendRequest' &&
            message.requestStatus === 'pending'
          ) {
            return {
              ...message,
              requestStatus: response,
              readStatus: 'read',
              date: Timestamp.now(),
            }
          }
          return message
        })

        // Step 3: Update the document with the modified messages array
        await updateDoc(notificationsRef, { messages })
      }
      if (response !== 'read') {
        await updateDoc(doc(db, 'notifications', userId), {
          messages: arrayUnion({
            id: uuid(),
            text: `${currentUser.displayName} ${response} your friend request.`,
            senderId: currentUser.uid,
            senderName: currentUser.displayName,
            senderImg: currentUser.photoURL,
            messageType: 'notification',
            readStatus: 'unread',
            date: Timestamp.now(),
          }),
        })
      }

      // setIsNotificationOpen(false)
      setError(null)
    } catch (err) {
      setError(err)
    }
  }
  const deleteNotification = async (notificationId) => {
    try {
      const notificationsRef = doc(db, 'notifications', currentUser.uid)
      const docSnap = await getDoc(notificationsRef)

      if (docSnap.exists()) {
        let messages = docSnap.data().messages || []
        messages = messages.filter((message) => message.id !== notificationId)
        await updateDoc(notificationsRef, { messages })
      }
      // setIsNotificationOpen(false)
      setError(null)
    } catch (err) {
      setError(err)
    }
  }

  return (
    <div className="p-2  flex flex-row gap-3">
      <img
        src={notification.senderImg}
        alt=""
        className="w-10 h-10 rounded-full object-cover mt-3"
      />

      <div>
        <div className="flex flex-row gap-2 items-center">
          <div className="font-bold text-lg">{notification.senderName}</div>
          <div className=" text-sm text-gray ">
            {notification.date.toDate().toLocaleString('en-US', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </div>
          {notification.readStatus === 'read' && (
            <i
              className="fas fa-trash-alt pl-2 text-gray cursor-pointer hover:text-black"
              onClick={() => deleteNotification(notification.id)}
            />
          )}
        </div>
        <div>{notification.text}</div>
        {notification.messageType === 'friendRequest' &&
          notification.requestStatus === 'pending' && (
            <div className="flex flex-row justify-start gap-1">
              <button
                className="px-2 py-1 bg-blue hover:font-bold text-white rounded-xl"
                onClick={() =>
                  handleNotificationRequest(
                    'accepted',
                    notification.senderId,
                    notification.senderName,
                    notification.senderImg
                  )
                }>
                Accept
              </button>
              <button
                className="px-2 py-1  rounded-xl hover:font-bold "
                onClick={() =>
                  handleNotificationRequest('rejected', notification.senderId)
                }>
                Decline
              </button>
            </div>
          )}
        {notification.messageType === 'notification' &&
          notification.readStatus === 'unread' && (
            <div className="flex flex-row justify-start gap-3">
              <button
                className="px-3 py-2 bg-blue text-[12px] rounded-xl text-white"
                onClick={() =>
                  handleNotificationRequest('read', notification.senderId)
                }>
                MARK READ
              </button>
            </div>
          )}
      </div>
    </div>
  )
}

export default Notification
