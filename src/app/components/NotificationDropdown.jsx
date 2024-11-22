import Image from "next/image";
import { motion } from "framer-motion";

const NotificationItem = ({ notification }) => (
  <div className="sm:w-[95%] w-[98%] min-h-[70px] mt-[20px] bg-[#CDCDE5] rounded-xl flex gap-2 items-center pl-4 mb-2">
    <Image 
      src={notification.avatar || "/images/avatarInvite.svg"} 
      alt="profile" 
      width={50} 
      height={50} 
      className="w-[40px] h-[40px]" 
    />
    <h4 className="font-semibold text-xs sm:text-base text-[#242F5C]">
      {notification.message}
    </h4>
    <Image 
      src="/images/Notif.svg" 
      alt="notification icon" 
      width={50} 
      height={50} 
      className="w-[10px] h-[10px] cursor-pointer mr-2 sm:mr-0" 
      onClick={() => notification.onAction && notification.onAction()}
    />
  </div>
);

const NotificationDropdown = ({ notifications = [] }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 30,
      }}
      className="w-[250px] sm:w-[400px] bg-[#EAEAFF] absolute top-[55px] right-[70px] z-[10] rounded-[5px] border-2 border-solid border-[#C0C7E0] shadow shadow-[#BCBCC9] overflow-hidden"
    >
      <div className="max-h-[30vh] overflow-y-auto custom-scrollbar">
        <div className="flex flex-col items-center min-h-full">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <NotificationItem key={index} notification={notification} />
            ))
          ) : (
            <div className="p-4 text-center text-[#242F5C]">
              No notifications
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationDropdown; 