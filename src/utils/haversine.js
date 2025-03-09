// src/utils/Haversine.js

export const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (angle) => (angle * Math.PI) / 180; // Chuyển độ sang radian

    const R = 6371000; // Bán kính Trái Đất (km)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Trả về khoảng cách (km)
};