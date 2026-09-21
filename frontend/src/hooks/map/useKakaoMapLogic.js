import {useState, useEffect} from 'react';
import {useKakaoLoader} from "react-kakao-maps-sdk";

export const useKakaoMapLogic = (selectedFacility, onBoundsChange) => {
    const {loading, error} = useKakaoLoader({
        appkey: import.meta.env.VITE_KAKAO_MAP_API_KEY,
        libraries: ["services", "clusterer"],
    });

    const [map, setMap] = useState(null);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [parkHoverId, setParkHoverId] = useState(null);

    // 선택된 시설이 변경될 때마다 지도를 이동
    useEffect(() => {
        if (map && selectedFacility) {
            const newPos = new window.kakao.maps.LatLng(
                selectedFacility.latitude,
                selectedFacility.longitude
            );
            map.panTo(newPos);
        }
    }, [map, selectedFacility]);

    const handleIdle = (map) => {
        const center = map.getCenter();
        const level = map.getLevel(); // 숫자가 클수록 멀리 보는 상태

        let radius;

        // 카카오맵 레벨 가이드:
        // 1~2레벨: 아주 가까움 (건물 하나하나 보임)
        // 3~4레벨: 동네 수준
        // 5~6레벨: 구 단위
        // 7~8레벨: 시 단위
        if (level <= 2) {
            radius = 0.5; // 500m
        } else if (level <= 4) {
            radius = 2;   // 2km
        } else if (level <= 6) {
            radius = 5;   // 5km
        } else if (level <= 8) {
            radius = 15;  // 15km
        } else if (level <= 10) {
            radius = 40;  // 40km
        } else {
            radius = 100; // 그 이상은 아주 넓게
        }

        console.log(`현재 줌 레벨: ${level}, 설정된 검색 반경: ${radius}km`);

        onBoundsChange(center.getLat(), center.getLng(), radius);
    };

    return {
        loading,
        error,
        setMap,
        hoverIndex,
        setHoverIndex,
        parkHoverId,
        setParkHoverId,
        handleIdle
    };
}