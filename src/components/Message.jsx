import { useContext } from 'react'
import { AppContext } from '../state/AppContext'
import { ChatContext } from '../state/ChatContext'

// eslint-disable-next-line react/prop-types
const Message = ({ message }) => {
  const { currentUser } = useContext(AppContext)
  const { data } = useContext(ChatContext)
  const isCurrentUser = currentUser.uid === message.sender //eslint-disable-line

  return (
    <div
      className={`flex flex-row items-start  ${
        isCurrentUser ? 'flex-row-reverse' : ''
      }`}>
      <div>
        <img
          src={isCurrentUser ? currentUser.photoURL : data.user.photoURL}
          alt=""
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className=" text-gray text-sm">just now</span>
      </div>
      <div
        className={` p-1 px-3 w-4/5 flex flex-col gap-3 ${
          isCurrentUser ? 'items-end' : ''
        } `}>
        {message.text && ( //eslint-disable-line
          <div
            className={` ${
              isCurrentUser
                ? 'rounded-s-lg rounded-ee-lg bg-green '
                : 'rounded-e-lg rounded-es-lg bg-white'
            }  max-w-80% w-fit break-words p-2 px-3  `}>
            {message.text} {/*eslint-disable-line*/}
          </div>
        )}
        {/* eslint-disable-next-line */}
        {message.img && <img src={message.img} alt="" className=" w-1/2 " />}
      </div>
    </div>
  )
}

export default Message
