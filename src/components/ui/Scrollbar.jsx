import { useState } from 'react'

// eslint-disable-next-line react/prop-types
const Scrollbar = ({ addClassName, children }) => {
  // const [isHover, setIsHover] = useState(false)
  // const handleMouseEnter = () => {
  //   setIsHover(true)
  // }
  // const handleMouseLeave = () => {
  //   setIsHover(false)
  // }

  return (
    <div className={`scrollbar-custom overflow-y-auto ${addClassName}`}>
      {children}
    </div>
  )
}

export default Scrollbar
