import { useState, useEffect, useCallback, useContext } from 'react';
import { FavoriteContext } from './FavoriteContext.jsx';
import { AuthContext } from '../auth/AuthContext.jsx';
import { getFavorites, addFavorite, removeFavorite } from '../../services/map/favoriteService.js';

export const FavoriteProvider = ({ children }) => {
    const { isLoggedIn } = useContext(AuthContext);
    const [favoriteList, setFavoriteList] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchFavorites = useCallback(async () => {
        if (!isLoggedIn) {
            setFavoriteList([]);
            return;
        }

        setLoading(true);
        try {
            const res = await getFavorites();
            const data = res.data?.list || res.data;
            setFavoriteList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("전역 즐겨찾기 로드 실패:", error);
            setFavoriteList([]);
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    // 특정 시설이 즐겨찾기 상태인지 확인
    const isFavorite = (facilityId) => {
        if (!Array.isArray(favoriteList)) return false;
        return favoriteList.some(item => (item.facilityId || item.facility?.id) === facilityId);
    };

    // 즐겨찾기 토글 (등록/해제)
    const toggleFavorite = async (facility) => {
        if (!isLoggedIn) {
            alert("즐겨찾기 기능은 로그인 후 이용 가능합니다.");
            return;
        }

        if (!facility) return;
        const facilityId = facility.id;
        const alreadyFav = isFavorite(facilityId);

        try {
            if (alreadyFav) {
                await removeFavorite(facilityId);
                setFavoriteList(prev => prev.filter(item => (item.facilityId || item.facility?.id) !== facilityId));
            } else {
                await addFavorite(facilityId);
                await fetchFavorites();
            }
        } catch (error) {
            console.error("즐겨찾기 토글 실패:", error.response || error);
            await fetchFavorites();
        }
    };

    return (
        <FavoriteContext.Provider value={{ favoriteList, loading, isFavorite, toggleFavorite, refetch: fetchFavorites }}>
            {children}
        </FavoriteContext.Provider>
    );
};
