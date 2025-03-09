import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAppContext } from "../context/AppContext";

const TrackSafeAreas = () => {
  const { listMarkers, setListMarkers } = useAppContext();

  useEffect(() => {
    const channel = supabase
      .channel("realtime_phoneNumber")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "markerdata" },
        async (payload) => {
          console.log(`Sự kiện: ${payload.eventType}`, payload.new || payload.old);
          
          if (payload.eventType === "DELETE") {
            console.log("Dữ liệu bị xoá:", payload.old);
            setListMarkers(listMarkers.filter(m => m.id !== payload.old.id));
          } 
          else if (payload.eventType === "UPDATE") {
            console.log("Dữ liệu cập nhật:", payload.new);
            setListMarkers(listMarkers.map(m => 
              m.id === payload.new.id ? payload.new : m
            ));
          } 
          else if (payload.eventType === "INSERT") {
            console.log("Dữ liệu mới:", payload.new);
            setListMarkers([...listMarkers, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [listMarkers, setListMarkers]); // ✅ Thêm dependencies vào useEffect

  return null;
};

export default TrackSafeAreas;