import React from 'react';

import scoreTrue from '../../../assets/images/icons/score-true.png';

const ParkItem = ({park}) => {
    // 쉼표를 포함한 면적 계산
    const formattedArea = park.area
        ? park.area.toLocaleString()
        : "정보 없음";

    return (
        <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm flex flex-col gap-3">
            {/* 상단: 카테고리 및 공원 이름 */}
            <div className="flex flex-col gap-1.5">
                <span
                    className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded w-fit border border-green-100">
                    {park.category}
                </span>
                <h4 className="text-[15px] font-bold text-gray-800 leading-tight flex items-center gap-1.5">
                    <img src={scoreTrue} alt="공원"
                         className="w-5 h-5 object-contain border border-transparent rounded-full"/>
                    <span>{park.name}</span>
                </h4>
            </div>

            {/* 상세 정보 */}
            <div className="space-y-2 border-t border-gray-50 pt-3">
                <div className="flex items-start gap-2.5">
                    <span className="text-xs shrink-0 mt-0.5">📍</span>
                    <p className="text-[13px] text-gray-600 leading-snug">
                        {park.lotAddress}
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    <span className="text-xs shrink-0">📐</span>
                    <p className="text-[12px] text-gray-500">
                        면적: <span className="font-medium text-gray-700">{formattedArea} m²</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ParkItem);