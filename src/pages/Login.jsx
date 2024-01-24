import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'

const Login = () => {
  const navigate = useNavigate()
  const [err, setErr] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = e.target[0].value
    const password = e.target[1].value
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)
      console.log(res)
      navigate('/')
    } catch (err) {
      setErr(true)
    }
  }
  return (
    <div className=" bg-bgcolor h-screen flex items-center justify-center">
      <div className=" bg-white px-14 py-6 rounded-md flex flex-col items-center">
        <span className="text-xl text-secondary font-semibold pb-3">
          Chat App
        </span>
        <span className="text-sm text-graymedium">Register</span>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="email"
            className=" border-b border-graymedium p-3 placeholder:text-sm"
          />
          <input
            type="password"
            placeholder="password"
            className=" border-b border-graymedium p-3 placeholder:text-sm "
          />

          <button className=" w-full bg-primary py-1 text-white">Log In</button>
        </form>
        <p className=" text-gray text-xs py-3">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
        {err && (
          <div className=" bg-red p-3 text-lg text-white">
            <p>Something went wrong</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
