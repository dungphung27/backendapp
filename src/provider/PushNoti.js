import { supabase } from "../lib/supabase";
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export const PushNoti = async (message,type,state) =>{
    const {  error } = await supabase
    .from('notifications') // Tên bảng trong database
    .insert([
      {
        id: getRandomInt(2,2000000000 ),
        created_at: new Date().toISOString().replace("T", " ").replace("Z", "+00"),
        message:message,
        type: type,
        state: state
      },
    ]);
  if (error) {
    console.error('Lỗi khi thêm noti:', error.message);
    return;
  }
  console.log('Thêm noti thành công:');
}