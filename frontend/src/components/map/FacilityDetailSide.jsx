import 'react';
import ParkItem from "./item/ParkItem.jsx";
import scoreTrue from '../../assets/images/icons/score-true.png';
import { useFavoriteContext } from '../../hooks/map/useFavoriteContext.js';
import {useAuth} from "../../hooks/auth/useAuth.js";

const FacilityDetailSide = ({ facility, parks, onClose }) => {
    const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8088';

    const {isLoggedIn} = useAuth();
    const { isFavorite, toggleFavorite } = useFavoriteContext();
    const hasFavorited = facility ? isFavorite(facility.id) : false;

    if (!facility) return null;

    return (
        <aside id="detailSidebar" className="map-detail-sidebar" aria-label={`${facility.facilityName} 상세 정보`}>
            <button id="closeSidebarBtn" type="button" aria-label="상세 정보 닫기" onClick={onClose} className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white shadow-md rounded-full hover:bg-gray-50 transition-all z-30 border border-gray-100 text-gray-500 text-lg">
                ✕
            </button>

            <div className="map-detail-image-frame w-full bg-gray-100 shrink-0">
                <img id="detailImage" src={`${IMAGE_BASE_URL}${facility.facilityImage}`} alt={facility.facilityName} className="map-detail-image w-full h-full object-cover" />
            </div>

            <div className="flex-1 overflow-y-auto p-5">
                <div className="mb-5">
                    <span className="inline-block text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-2.5">시설 상세정보</span>
                    <div className="flex items-center justify-between gap-2">
                        <h2 id="detailName" className="text-xl font-extrabold text-gray-900 leading-tight">{facility.facilityName}</h2>

                        {/* 즐겨찾기 버튼 연동 */}
                        {isLoggedIn ? <button
                            id="favoriteBtn"
                            onClick={() => toggleFavorite(facility)}
                            className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-full border transition-all ${
                                hasFavorited ? "bg-red-50 border-red-100 text-red-500" : "bg-gray-50 border-gray-100 text-gray-400 hover:text-red-400"
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={hasFavorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                            </svg>
                        </button> : null}
                    </div>

                    <div className="flex items-center mt-2.5 justify-between">
                        <div className="relative flex items-center space-x-1 group cursor-pointer">
                            <img src={scoreTrue} alt="점수 아이콘" className="w-5 h-5 object-contain" />
                            <span id="detailScore" className="text-sm font-bold text-gray-700 ml-1">
                                {Number(facility.facilityScore || 0).toFixed(1)}
                            </span>
                            {/* 마우스 오버 시 나타나는 말풍선 오버레이 */}
                            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex flex-col items-start z-30 w-52">
                                <div className="bg-gray-800 text-white text-[11px] font-medium px-2.5 py-2 rounded shadow-md leading-normal text-left break-keep">
                                    <strong className="text-white block mb-1">시설 점수란?</strong>
                                    인근 공원의 개수와 총면적을 종합적으로 분석하여 산출한 공원 접근성 점수입니다. (0~5점)
                                </div>
                                {/* 말풍선 꼬리 */}
                                <div className="w-2 h-2 bg-gray-800 rotate-45 -mt-1 ml-4"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-100 w-full mb-5"></div>
                <div className="space-y-4 text-sm">
                    <div className="flex items-start">
                        <span className="mr-4 mt-0.5 w-6 text-center">📍</span>
                        <div className="flex-1">
                            <p id="detailNewAddress" className="font-medium text-gray-800 leading-snug">{facility.newAddress}</p>
                            <p id="detailLotAddress" className="text-xs text-gray-400 mt-1.5">{facility.lotAddress || ""}</p>
                        </div>
                    </div>
                    {facility.facilityTel && (
                        <div id="detailPhoneContainer" className="flex items-center">
                            <span className="mr-4 w-6 text-center">📞</span>
                            <p id="detailTel" className="font-medium text-blue-600 hover:underline cursor-pointer tracking-wide">{facility.facilityTel}</p>
                        </div>
                    )}
                </div>

                <div className="h-px bg-gray-100 w-full my-6"></div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <img src={scoreTrue} alt="공원" className="w-7 h-7 object-contain border border-transparent rounded-full"/>
                        인근 공원 <span id="parkCount" className="text-green-600 text-sm font-medium">{parks?.length || 0}</span>
                    </h3>
                    <div id="nearbyParkList" className="flex flex-col gap-3">
                        {parks && parks.length > 0 ? parks.map((park) => <ParkItem key={park.id} park={park}/>) : (
                            <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-sm text-gray-400 italic font-medium">주변 공원 정보가 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default FacilityDetailSide;
