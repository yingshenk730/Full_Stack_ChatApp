import { useState } from 'react'
import AddAvatar from '../img/addAvatar.png'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, storage, db } from '../firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'

const Register = () => {
  const [iserr, setIsErr] = useState(false)
  const [img, setImg] = useState(null)
  const navigate = useNavigate()

  const handleImgChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImg(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const displayName = e.target[0].value
    const email = e.target[1].value
    const password = e.target[2].value
    const file = e.target[3].files[0]

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      // console.log(res.user)
      //Create a unique image name
      const date = new Date().getTime()
      const storageRef = ref(storage, `${displayName + date}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          setIsErr(true)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            })
            await setDoc(doc(db, 'users', res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            })
            await setDoc(doc(db, 'userFriends', res.user.uid), {})
            await setDoc(doc(db, 'notifications', res.user.uid), {
              messages: [],
            })
            navigate('/')
          })
        }
      )
    } catch (err) {
      setIsErr(true)
      console.log(err)
    }
  }
  return (
    <div className=" bg-bgcolor h-screen flex items-center justify-center">
      <div className=" bg-white px-14 py-6 rounded-md flex flex-col items-center">
        <span className="text-xl text-secondary font-semibold pb-3">
          Chat App
        </span>
        <span className="text-sm text-graymedium">Register</span>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="username"
            className=" border-b border-graymedium p-3 placeholder:text-sm outline-none"
          />
          <input
            type="text"
            placeholder="email"
            className=" border-b border-graymedium p-3 placeholder:text-sm outline-none"
          />
          <input
            type="password"
            placeholder="password"
            className=" border-b border-graymedium p-3 placeholder:text-sm outline-none"
          />
          <input
            type="file"
            id="file"
            className="hidden"
            onChange={handleImgChange}
          />
          <label
            htmlFor="file"
            className="flex items-center gap-2 cursor-pointer">
            {img ? (
              <img className="w-10 h-10 object-cover" src={img} />
            ) : (
              <>
                <img className="w-8 h-8" src={AddAvatar} />
                <span className="text-sm text-graymedium">Add Avatar</span>
              </>
            )}
          </label>
          <button className=" w-full bg-primary py-1">Register</button>
          {iserr && <span className=" text-red">Something went wrong</span>}
        </form>
        <p className=" text-gray text-xs py-3">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-blue">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
