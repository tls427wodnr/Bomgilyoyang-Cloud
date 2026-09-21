import { useState } from "react";
import FacilityItem from "./item/FacilityItem.jsx";
import FacilityFavoriteList from "./FacilityFavoriteList.jsx";
import { useFacilitySearch } from "../../hooks/map/useFacilitySearch.js";

const FacilitySearchList = ({ coords, facilities, setFacilities, onSelectFacility, selectedId }) => {
    const { keyword, setKeyword, loading: searchLoading, lastElementRef } = useFacilitySearch(coords, setFacilities);
    const [activeTab, setActiveTab] = useState("search");

    return (
        <>
            {/* 검색창 영역 */}
            <div className="p-3 bg-white">
                <input
                    type="text" value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="지역명을 검색하세요"
                    aria-label="지역명 검색"
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
                />
            </div>

            {/* 토글 탭 메뉴 */}
            <div className="flex border-b border-gray-100 bg-white px-3 pb-1">
                <button
                    onClick={() => setActiveTab("search")}
                    className={`flex-1 py-1.5 text-center text-sm font-semibold border-b-2 transition-all ${
                        activeTab === "search" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                >
                    검색 결과
                </button>
                <button
                    onClick={() => setActiveTab("favorite")}
                    className={`flex-1 py-1.5 text-center text-sm font-semibold border-b-2 transition-all ${
                        activeTab === "favorite" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                >
                    즐겨찾기
                </button>
            </div>

            {/* 하단 리스트 영역 */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {/* 1. 검색 결과 탭 활성화 시 */}
                {activeTab === "search" && (
                    <>
                        {facilities.map((item, index) => (
                            <FacilityItem
                                key={item.id}
                                item={item}
                                isSelected={selectedId === item.id}
                                onClick={() => onSelectFacility(item)}
                                ref={facilities.length === index + 1 ? lastElementRef : null}
                            />
                        ))}
                        {searchLoading && <div className="text-center py-4 text-gray-400 animate-pulse text-sm">로딩 중...</div>}
                        {!searchLoading && facilities.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">검색 결과가 없습니다.</div>}
                    </>
                )}

                {/* 2. 즐겨찾기 탭 활성화 시 */}
                {activeTab === "favorite" && (
                    <FacilityFavoriteList
                        selectedId={selectedId}
                        onSelectFacility={onSelectFacility}
                    />
                )}
            </div>
        </>
    );
};

export default FacilitySearchList;
