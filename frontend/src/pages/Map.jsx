import FacilitySearchList from '../components/map/FacilitySearchList.jsx';
import KakaoMap from '../components/map/KakaoMap.jsx';
import FacilityDetailSide from "../components/map/FacilityDetailSide.jsx";
import {useFacilityMap} from '../hooks/map/useFacilityMap.js';
import { FavoriteProvider } from '../context/favorite/FavoriteProvider.jsx';
import './Map.css';

const Map = () => {
    const {
        facilities, setFacilities,
        markers, parks, coords,
        selectedFacility, setSelectedFacility, isDetailOpen, setIsDetailOpen,
        handleBoundsChange, handleOpenDetail, handleToggleDetail
    } = useFacilityMap();

    return (
        <FavoriteProvider>
            <div className="map-page">
                <aside className="map-search-sidebar" aria-label="요양시설 검색">
                    <FacilitySearchList
                        coords={coords}
                        facilities={facilities}
                        setFacilities={setFacilities}
                        onSelectFacility={(item) => {
                            setSelectedFacility(item);
                            setIsDetailOpen(false);
                            handleOpenDetail(item.id);
                        }}
                        selectedId={selectedFacility?.id}
                    />
                </aside>
                {isDetailOpen && (
                    <FacilityDetailSide
                        facility={selectedFacility}
                        parks={parks}
                        onClose={() => setIsDetailOpen(false)}
                    />
                )}

                <div className="map-canvas">
                    <KakaoMap
                        coords={coords}
                        markers={markers}
                        parks={parks}
                        onBoundsChange={handleBoundsChange}
                        selectedFacility={selectedFacility}
                        onSelectMarker={handleToggleDetail}
                    />
                </div>
            </div>
        </FavoriteProvider>
    );
};

export default Map;
