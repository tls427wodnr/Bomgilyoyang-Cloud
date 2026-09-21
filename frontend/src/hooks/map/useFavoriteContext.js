import { useContext } from 'react';
import { FavoriteContext } from '../../context/favorite/FavoriteContext.jsx';

export const useFavoriteContext = () => {
    const context = useContext(FavoriteContext);
    if (!context) {
        throw new Error("useFavoriteContext must be used within a FavoriteProvider");
    }
    return context;
};