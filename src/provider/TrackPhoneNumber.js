import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAppContext } from "../context/AppContext";

const TrackPhoneNumber = () => {
  const { setSdt } = useAppContext();

  useEffect(() => {
    const channel = supabase
      .channel("realtime_markerdata")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "phoneNumber" }, // 🔥 Theo dõi mọi thay đổi
        async (payload) => {
          console.log(`Sự kiện: ${payload.eventType}`, payload.new || payload.old);
          setSdt(payload.new.sdt.substring(1))
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null; // Không cần render gì
};
export default TrackPhoneNumber;