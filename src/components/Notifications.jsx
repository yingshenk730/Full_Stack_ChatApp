import React from 'react'
import Notification from './widget/Notification'
import Scrollbar from './ui/Scrollbar'

const Notifications = ({
  setIsNotificationOpen,
  unreadNotifications,
  readNotifications,
}) => {
  return (
    <div
      className="border-0 rounded-lg  shadow-lg absolute top-6 right-1 max-w-96 max-h-96 min-w-80 overflow-y-auto flex flex-col p-3   bg-white outline-none focus:outline-none"
      onMouseDown={(e) => e.stopPropagation()}>
      {/*close modal icon*/}
      {/* <i
        className="fas fa-times absolute top-1 right-3 text-gray cursor-pointer text-2xl flex justify-end hover:text-graydark"
        onClick={() => setIsNotificationOpen(false)}></i> */}
      <div className=" font-semibold  text-center border-b border-graymedium pb-2">
        Notifications
      </div>
      {unreadNotifications.length > 0 && (
        <div className="font-semibold pt-3">
          You have {unreadNotifications.length} Unread notifications:
        </div>
      )}
      <div className=" font-semibold">
        {unreadNotifications
          .sort((a, b) => b.date - a.date)
          .map((notification) => (
            <Notification
              key={notification.id}
              notification={notification}
              setIsNotificationOpen={setIsNotificationOpen}
            />
          ))}
      </div>
      {readNotifications.length > 0 && (
        <div className="font-semibold text-gray pt-3">
          You have {readNotifications.length} History notifications:
        </div>
      )}
      {readNotifications
        .sort((a, b) => b.date - a.date)
        .map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            setIsNotificationOpen={setIsNotificationOpen}
          />
        ))}
    </div>
  )
}

export default Notifications
