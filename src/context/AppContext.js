import React, { createContext, useContext, useState } from "react";

// 1️⃣ Tạo Context
export const AppContext = createContext();

// 2️⃣ Tạo Provider
export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Ví dụ: Trạng thái user
    const [isTracking, setIsTracking] = useState(true); // Trạng thái theo dõi
    const [user2,setUser2] = useState(null)
    const [listMarkers,setListMarkers] = useState([])
    const [sdt,setSdt] = useState("")
    const [start,setStart]= useState(false)
    const [state1,setState1] = useState(false)
    const [state2,setState2] = useState(false)
    const [state3,setState3] = useState(false)
    const [state4,setState4] = useState(false)
    const [listSafeArea,setListSafeArea]= useState([])
    const [isNearby,setIsNearBy] = useState(false)
    return (
        <AppContext.Provider value={{
             user, setUser, 
             isTracking,setIsTracking,
            user2, setUser2,
            listMarkers,setListMarkers,
            sdt,
            setSdt,start,setStart,
            state1,setState1,state2,setState2,state3,setState3,
            state4,setState4,listSafeArea,setListSafeArea,isNearby,setIsNearBy
             }}>
            {children}
        </AppContext.Provider>
    );
};
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};

