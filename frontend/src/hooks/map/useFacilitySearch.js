import {useState, useEffect, useRef, useCallback} from 'react';
import {getFacilities} from "../../services/map/mapService.js";

export const useFacilitySearch = (coords, setFacilities) => {
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [lastId, setLastId] = useState(null);
    const [lastValue, setLastValue] = useState(null);
    const observer = useRef();

    const fetchPage = useCallback(async (isFirstLoad = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const params = {
                keyword, size: 10, sort: 'distance',
                lastId: isFirstLoad ? null : lastId,
                lastValue: isFirstLoad ? null : lastValue,
                userLat: coords.lat, userLon: coords.lon,
            };
            const response = await getFacilities(params);
            const data = Array.isArray(response.data) ? response.data : [];

            setFacilities(prev => isFirstLoad ? data : [...prev, ...data]);
            setHasNextPage(data.length === 10);

            if (data.length > 0) {
                const last = data[data.length - 1];
                setLastId(last.id);
                setLastValue(last.distance);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [keyword, lastId, lastValue, coords, setFacilities]);

    useEffect(() => {
        const timer = setTimeout(() => fetchPage(true), 400);
        return () => clearTimeout(timer);
    }, [keyword, coords.lat, coords.lon]);

    const lastElementRef = useCallback(node => {
        if (loading || !hasNextPage) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) fetchPage(false);
        });
        if (node) observer.current.observe(node);
    }, [loading, hasNextPage, fetchPage]);

    return {
        keyword,
        setKeyword,
        loading,
        lastElementRef
    };
}