import {Fragment} from "react";
import {Map, MapMarker, CustomOverlayMap} from "react-kakao-maps-sdk";
import BasicMarkerOverlay from "./overlay/BasicMarkerOverlay.jsx";
import ParkMarkerOverlay from "./overlay/ParkMarkerOverlay.jsx";
import {useKakaoMapLogic} from "../../hooks/map/useKakaoMapLogic.js";

const KakaoMap = ({coords, markers, parks, onBoundsChange, selectedFacility, onSelectMarker}) => {
    const {
        loading,
        error,
        setMap,
        hoverIndex,
        setHoverIndex,
        parkHoverId,
        setParkHoverId,
        handleIdle
    } = useKakaoMapLogic(selectedFacility, onBoundsChange);

    if (error) return <div className="h-full flex items-center justify-center">에러 발생</div>;
    if (loading) return <div className="h-full flex items-center justify-center">로딩 중...</div>;

    return (
        <Map
            center={{lat: coords.lat, lng: coords.lon}}
            className="w-full h-full"
            level={4}
            onIdle={handleIdle}
            onCreate={setMap}
        >
            {/* 내 위치 마커 */}
            <MapMarker position={{lat: coords.lat, lng: coords.lon}}/>

            {/* 시설 마커들 */}
            {markers?.map((pos, index) => {
                const isSelected = selectedFacility?.id === pos.id;
                const position = {lat: Number(pos.latitude), lng: Number(pos.longitude)};

                return (
                    <Fragment key={pos.id || index}>
                        <MapMarker
                            position={position}
                            // 마커 클릭 시 부모 상태 업데이트 -> useEffect가 감지하여 panTo 실행
                            onClick={() => onSelectMarker(pos)}
                            onMouseOver={() => setHoverIndex(index)}
                            onMouseOut={() => setHoverIndex(null)}
                            zIndex={isSelected ? 10 : 1}
                            image={{
                                // 선택 여부에 따른 이미지 변경
                                src: isSelected
                                    ? "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png" // 선택됨
                                    : "http://localhost:5173/src/assets/images/icons/mark/basic_marker.png", // 기본
                                size: {width: 24, height: 35},
                            }}
                        />
                        {(hoverIndex === index || isSelected) && (
                            <CustomOverlayMap position={position} yAnchor={2.3} zIndex={100}>
                                <BasicMarkerOverlay
                                    facilityName={pos.facilityName}
                                    isSelected={isSelected}
                                    onClick={() => onSelectMarker(pos)}
                                />
                            </CustomOverlayMap>
                        )}
                    </Fragment>
                );
            })}

            {/* 3. 인근 공원 마커들 (시설이 선택되었을 때만 표시) */}
            {selectedFacility && parks?.map((park) => (
                <Fragment key={`park-${park.id}`}>
                    <MapMarker
                        position={{lat: Number(park.latitude), lng: Number(park.longitude)}}
                        onMouseOver={() => setParkHoverId(park.id)}
                        onMouseOut={() => setParkHoverId(null)}
                        image={{
                            src: "http://localhost:5173/src/assets/images/icons/mark/park_marker.png",
                            size: {width: 24, height: 35},
                        }}
                    />
                    {parkHoverId === park.id && (
                        <CustomOverlayMap position={{lat: Number(park.latitude), lng: Number(park.longitude)}}
                                          yAnchor={1.4} zIndex={110}>
                            <ParkMarkerOverlay park={park}/>
                        </CustomOverlayMap>
                    )}
                </Fragment>
            ))}
        </Map>
    );
};

export default KakaoMap;