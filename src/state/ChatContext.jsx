import { createContext, useContext, useReducer } from 'react'
import { AppContext } from './AppContext'

export const ChatContext = createContext()

// eslint-disable-next-line react/prop-types
export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AppContext)

  const INITIATE_STATE = {
    chatId: '',
    user: {},
  }

  const chatReducer = (state, action) => {
    if (!currentUser || !currentUser.uid) {
      // 处理未定义的情况或返回初始状态
      return state
    }

    switch (action.type) {
      case 'CHANGE_USER':
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        }
      default:
        return state
    }
  }
  const [state, dispatch] = useReducer(chatReducer, INITIATE_STATE)
  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  )
}
