import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppContext } from './state/AppContext'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'

function App() {
  const { currentUser } = useContext(AppContext)
  // console.log(currentUser)

  //eslint-disable-next-line
  const ProtectedRoute = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App
