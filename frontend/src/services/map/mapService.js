import api from '../../api/axios.js';

/**
 * 시설 목록 조회 (검색, 정렬, 페이징 포함)
 * @param {Object} params - keyword, userLat, userLon, sort, lastId, lastValue, size
 */
export const getFacilities = (params) => {
    return api.get('/api/map/facilities', {params});
};

/**
 * 특정 시설 상세정보 조회
 * @param {string} facilityId
 */
export const getFacilityDetail = (facilityId) => {
    return api.get(`/api/map/facilities/${facilityId}`);
};

/**
 * 지도 시설 마커 조회 (반경 기반)
 * @param {Object} params - lat, lon, radius
 */
export const getFacilityMarkers = (params) => {
    return api.get('/api/map/facilities/markers', {params});
};

/**
 * 특정 시설 근처 공원 조회
 * @param {string} facilityId
 * @param {number} radius - 기본값 3(km)
 */
export const getNearbyParks = (facilityId, radius = 3) => {
    return api.get(`/api/map/facilities/markers/${facilityId}/nearby-parks`, {
        params: {radius}
    });
};