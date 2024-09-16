import { createContext, useState } from "react";
import { Montserrat } from "next/font/google";
export const DashContext = createContext();

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
});

const DashProvider = ({ children }) => {
    const [userDropdown, setUserDropdown] = useState(false);
    const [notificationDropdown, setNotificationDropdown] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
  

    const [matchHistory, setMatchHistory] = useState([
        {
            avatar: "/images/avatar1.svg",
            name: "Ali",
            score: "5-4",
            result: "Win",
            map: "Blue"
        },
        {
            avatar: "/images/avatar1.svg",
            name: "Ali",
            score: "5-4",
            result: "Win",
            map: "Blue"
        },
        {
            avatar: "/images/avatar1.svg",
            name: "Ali",
            score: "5-4",
            result: "Win",
            map: "Blue"
        },
          
        {
            avatar: "/images/avatar1.svg",
            name: "Ali",
            score: "5-4",
            result: "Win",
            map: "Blue"
        },
        {
            avatar: "/images/avatar1.svg",
            name: "Ali",
            score: "5-4",
            result: "Win",
            map: "Blue"
        },
        {
            avatar: "/images/avatar1.svg",
            name: "Ali",
            score: "5-4",
            result: "Win",
            map: "Blue"
        },
        {
            avatar: "/images/avatar1.svg",
            name: "Ali",
            score: "5-4",
            result: "Win",
            map: "Blue"
        },
    ]);
    return (
        <DashContext.Provider value={{
            userDropdown,
            setUserDropdown,
            notificationDropdown,
            setNotificationDropdown,
            isMobile,
            setIsMobile,
            isScrolled,
            setIsScrolled,
            matchHistory,
            setMatchHistory,
            montserrat,
        }}>
            {children}
        </DashContext.Provider>
    );
}

export default DashProvider;






