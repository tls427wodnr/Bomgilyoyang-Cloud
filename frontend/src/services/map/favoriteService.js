import api from '../../api/axios.js';

// 즐겨찾기 추가
export const addFavorite = (facilityId) => {
    return api.post('/api/favorites', {facilityId});
};

// 내 즐겨찾기 목록 조회
export const getFavorites = () => {
    return api.get('/api/favorites/me');
};

// 즐겨찾기 삭제
export const removeFavorite = (facilityId) => {
    return api.delete('/api/favorites/me', {
        data: {facilityId}
    });
};