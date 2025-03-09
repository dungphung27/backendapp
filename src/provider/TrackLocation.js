import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAppContext } from "../context/AppContext";

const TrackLocation = () => {
  const { setUser,setUser2} = useAppContext();

    useEffect(() => {
    const channel = supabase
      .channel("realtime_userdata")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "userdata" },
        async (payload) => {
          if (payload.new.id === 2) {
            console.log("Tọa độ cập nhật user id 2:", payload.new.lat, payload.new.long);
            setUser2(payload.new);
          } else {
            console.log("Tọa độ cập nhật user id 1 :", payload.new.lat, payload.new.long);
            setUser(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setUser2,setUser]); // ✅ Đã thêm setUser vào dependencies

  return null; // Không render gì, chỉ dùng để theo dõi dữ liệu
};

export default TrackLocation;