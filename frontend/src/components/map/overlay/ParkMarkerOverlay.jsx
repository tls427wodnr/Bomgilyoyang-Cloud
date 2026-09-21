const ParkMarkerOverlay = ({park}) => {
    return (
        <div className="bg-white p-3 rounded-xl shadow-2xl border-2 border-green-500 min-w-[200px] animate-fade-in">
            {/* 상단: 카테고리 및 이름 */}
            <div className="flex flex-col gap-1 mb-2">
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded w-fit">
                    {park.category || "공원"}
                </span>
                <h4 className="text-sm font-extrabold text-gray-800 flex items-center gap-1">
                    🌳 {park.name}
                </h4>
            </div>

            {/* 상세 정보 영역 */}
            <div className="space-y-1 border-t border-gray-100 pt-2">
                <p className="text-[11px] text-gray-600 flex items-start">
                    <span className="mr-1 shrink-0">📍</span>
                    <span className="break-all">{park.lotAddress}</span>
                </p>
                {park.area && (
                    <p className="text-[11px] text-gray-500 flex items-center">
                        <span className="mr-1 shrink-0">📐</span>
                        면적: {park.area.toLocaleString()} m²
                    </p>
                )}
            </div>

            {/* 아래쪽 화살표(꼬리) 디자인 (선택사항) */}
            <div
                className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-green-500 rotate-45">
            </div>
        </div>
    );
};

export default ParkMarkerOverlay;