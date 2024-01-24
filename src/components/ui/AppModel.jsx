import React from 'react'

export default function AppModal(props) {
  // eslint-disable-next-line react/prop-types
  const { showModal, setShowModal, children, style } = props
  return (
    <div
      className={`${showModal ? 'fixed' : 'hidden'} inset-0 z-50`}
      onMouseDown={() => setShowModal(false)}>
      <div
        className={`justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none `}>
        <div className="relative w-1/2">
          <div
            className={`border-0 rounded-lg shadow-lg absolute  ${style} flex flex-col p-3 bg-white outline-none focus:outline-none`}
            onMouseDown={(e) => e.stopPropagation()}>
            {/*close modal icon*/}
            <i
              className="fas fa-times absolute top-1 right-3 text-gray cursor-pointer text-2xl flex justify-end hover:text-graydark"
              onClick={() => setShowModal(false)}></i>
            {children}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
  )
}
