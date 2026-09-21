import { useState, useEffect, useCallback } from 'react';
import { addFavorite, removeFavorite, getFavorites } from '../../services/map/favoriteService.js';

export function useFacilityFavorite(facilityId) {
    const [isFavorite, setIsFavorite] = useState(false);

    // 로그인 여부 확인 함수
    const isAuthenticated = useCallback(() => {
        return !!localStorage.getItem('accessToken');
    }, []);

    // 즐겨찾기 여부 확인
    useEffect(() => {
        if (!facilityId || !isAuthenticated()) {
            setIsFavorite(false);
            return;
        }

        const checkFavorite = async () => {
            try {
                const response = await getFavorites();
                const favorites = response.data || [];
                setIsFavorite(favorites.some(fav => fav.facilityId === facilityId));
            } catch (error) {
                console.error("즐겨찾기 목록 로드 실패", error);
            }
        };

        checkFavorite();
    }, [facilityId, isAuthenticated]);

    // 즐겨찾기 토글 핸들러
    const toggleFavorite = useCallback(async () => {
        if (!isAuthenticated()) {
            alert("즐겨찾기 기능은 로그인 후 이용 가능합니다.");
            return;
        }

        if (!facilityId) return;

        try {
            if (isFavorite) {
                await removeFavorite(facilityId);
                setIsFavorite(false);
            } else {
                await addFavorite(facilityId);
                setIsFavorite(true);
            }
        } catch (error) {
            console.error("즐겨찾기 처리 실패", error);
            alert("즐겨찾기 처리 중 오류가 발생했습니다.");
        }
    }, [facilityId, isFavorite, isAuthenticated]);

    return { isFavorite, toggleFavorite };
}