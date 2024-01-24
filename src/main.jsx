import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AppContextProvider } from './state/AppContext.jsx'
import { ChatContextProvider } from './state/ChatContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppContextProvider>
    <ChatContextProvider>
      <App />
    </ChatContextProvider>
  </AppContextProvider>
)
