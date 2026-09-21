import {useState, useEffect} from 'react';
import {getFacilityMarkers, getNearbyParks, getFacilityDetail} from "../../services/map/mapService.js";

export const useFacilityMap = () => {
    const [facilities, setFacilities] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [parks, setParks] = useState([]);
    const [coords, setCoords] = useState({lat: 37.5665, lon: 126.9780});
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        const fetchParks = async () => {
            if (selectedFacility) {
                try {
                    const response = await getNearbyParks(selectedFacility.id, 3); // 반경 3km
                    setParks(Array.isArray(response.data) ? response.data : []);
                } catch (error) {
                    console.error("공원 데이터 로드 실패", error);
                    setParks([]);
                }
            } else {
                setParks([]); // 선택 해제 시 공원 리스트 초기화
            }
        };
        fetchParks();
    }, [selectedFacility]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setCoords({lat: pos.coords.latitude, lon: pos.coords.longitude}),
                (err) => console.error(err)
            );
        }
    }, []);

    const handleBoundsChange = async (lat, lon, radius) => {
        try {
            const response = await getFacilityMarkers({lat, lon, radius});
            setMarkers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error(error);
        }
    };

    // 상세 정보를 호출하고 사이드바를 여는 함수
    const handleOpenDetail = async (facilityId) => {
        try {
            // 1. 상세 정보 API 호출
            const response = await getFacilityDetail(facilityId);
            const detailData = response.data;

            // 2. 상세 데이터로 상태 업데이트
            setSelectedFacility(detailData);
            setIsDetailOpen(true);
        } catch (error) {
            console.error("시설 상세 정보 로드 실패", error);
            alert("상세 정보를 불러올 수 없습니다.");
        }
    };

    const handleToggleDetail = (facility) => {
        // 이미 열려있는 시설을 다시 클릭하면 닫기
        if (selectedFacility?.id === facility.id && isDetailOpen) {
            setIsDetailOpen(false);
        } else {
            // 아니면 상세 정보 호출
            handleOpenDetail(facility.id);
        }
    };

    return {
        facilities, setFacilities,
        markers, parks, coords,
        selectedFacility, setSelectedFacility,
        isDetailOpen, setIsDetailOpen,
        handleBoundsChange, handleOpenDetail, handleToggleDetail
    };
}