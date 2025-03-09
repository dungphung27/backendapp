import { useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAppContext } from "../context/AppContext";
import { haversineDistance } from "../utils/haversine";
import { PushNoti } from "./PushNoti";
import sendWhatsAppMessage from "./sendMessage";
const MyComponent = () => {
    const { setUser, setUser2,setListMarkers,setSdt,user,user2,start,setStart,setState2,setState3,setState4,state3,state4,isNearby,setListSafeArea,listSafeArea,setIsNearBy,sdt,listMarkers } = useAppContext();
    const hasRun = useRef(false); // Tránh chạy lại nhiều lần
    const timeoutRef = useRef(null);
    const intervalRef = useRef(null)
    const timeoutDone = useRef(false)
    const updateUserSOS = async () => {
        const { data, error } = await supabase
            .from('userdata') // Tên bảng trong database
            .update({ emergencyMode :false }) // Cập nhật giá trị cột `radius`
            .eq('id', 2); // Điều kiện để tìm dòng có id = 16
        if (error) {
            console.error('Lỗi khi cập nhật radius:', error.message);
            return;
        }
        console.log('Cập nhật thành công:');
        };
    const fetchUser = useCallback(async () => {
        const { data, error } = await supabase
            .from('userdata')
            .select('*')
        if (error) {
            console.error('Lỗi khi lấy dữ liệu:', error.message);
            return;
        }
        console.log('Dữ liệu lấy được:', JSON.stringify(data, null, 2));
        data.forEach(d =>{
            if(d.id === 1)
            {
                setUser(d);
            } else {
                setUser2(d)
            }
        })
    }, [setUser,setUser2]); // ✅ Đảm bảo dependency không thay đổi
    
    const fetchLocations = useCallback(async () => {
        const { data, error } = await supabase
            .from('markerdata')
            .select('*');

        if (error) {
            console.error('Lỗi khi lấy dữ liệu:', error.message);
            return;
        }
        console.log('Dữ liệu lấy được:', data);
        setListMarkers(data);
    }, [setListMarkers]); // ✅ Đảm bảo dependency không thay đổi
    const fetchSdt = useCallback(async () => {
        const { data, error } = await supabase
            .from('phoneNumber')
            .select('*');

        if (error) {
            console.error('Lỗi khi lấy dữ liệu:', error.message);
            return;
        }
        console.log('Dữ liệu lấy được:', data);
        setSdt(data[0].sdt.substring(1))
    }, [setSdt]);

    useEffect(()=>{
        if(user2)
        {
            if(user2.emergencyMode)
            {
                console.log("send SOS")
                //pushNoti SOS
                sendWhatsAppMessage(sdt,`Alert: There is a emergency situation from ${user2.name}`)
                PushNoti("",1,true)
                updateUserSOS()
            }
            if(start)
            {
                if ((user2.battery > 20) != state3)
                {
                    if (user2.battery > 20)  sendWhatsAppMessage(sdt,`Your battery device is at ${user2.battery}`)
                    else sendWhatsAppMessage(sdt,"Your device is no longer to shut down, please connect your device to charging source" )
                    
                    PushNoti("",3,user2.battery > 20)
                    setState3(user2.battery > 20)
                }
                if(user2.isCharging != state4)
                {
                    user2.isCharging ? sendWhatsAppMessage(sdt,"Your device is connected to charging source") : sendWhatsAppMessage(sdt,"Your device isn't connected to charging source")
                    // pushNoti state4
                    PushNoti("",4,user2.isCharging)
                    setState4(user2.isCharging)
                }
            }
            
        }
        if(user && user2 && listMarkers)
        {
            let distance = haversineDistance(user.lat,user.long,user2.lat,user2.long)
            const stateNearby = distance < user2.radius
            let safeArea = []
            listMarkers.forEach(m => {
                let distance1 = haversineDistance(m.lat,m.long,user2.lat,user2.long)
                if(distance1 < m.radius)
                {
                    safeArea = [...safeArea,m.name]
                }
            });
            safeArea = [...safeArea].sort();
            console.log(safeArea)
            if(!start)
            {
                setStart(true)
                setIsNearBy(stateNearby)
                setListSafeArea(safeArea);
                setState2(safeArea.length !==0)
                setState3(user2.battery > 20)
                setState4(user2.isCharging)
            } else {
                const isSafeAreaEqual = JSON.stringify(listSafeArea) === JSON.stringify(safeArea);
                if(stateNearby !== isNearby || !isSafeAreaEqual)
                {
                    timeoutDone.current = false
                    if(intervalRef.current) clearInterval(intervalRef.current)
                    if(timeoutRef.current)
                        clearTimeout(timeoutRef.current)
                    if(stateNearby !== isNearby)
                        safeArea =[...safeArea,'near you']
                    const strArea = safeArea.join(", ")   
                    console.log(strArea)
                    setIsNearBy(stateNearby)
                    setState2(safeArea.length !==0)
                    setListSafeArea(safeArea)
                    timeoutRef.current = setTimeout(()=>{
                        let message = `${user2.name} is in safe area: ${strArea}`
                        console.log(sdt)
                        sendWhatsAppMessage(sdt,message)
                        PushNoti(strArea,2,(strArea.length!==0 || stateNearby))
                        timeoutDone.current = true
                        if(!isNearby && safeArea.length ===0 && timeoutDone.current)
                        {
                            if(!intervalRef.current)
                            {

                                intervalRef.current = setInterval(()=>{
                                    console.log("unsafe")
                                    PushNoti("",2,false)
                                },20000)
                            } 
                        }
                    },10000)
                }
                
            }
        }
    },[user,user2,listMarkers])
    useEffect(() => {
        if (!hasRun.current) {
            console.log("Hàm chỉ chạy một lần khi mở web!");
            hasRun.current = true; // Đánh dấu đã chạy
            fetchUser();
            fetchLocations();
            fetchSdt()
        }
    }, [fetchUser, fetchLocations]); // ✅ Không còn cảnh báo ESLint

};
    
export default MyComponent;