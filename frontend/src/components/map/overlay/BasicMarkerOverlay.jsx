const BasicMarkerOverlay = ({facilityName, isSelected, onClick}) => {
    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            className={`bg-white px-3 py-1 rounded-full shadow-lg border-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                    ? "border-blue-600 text-blue-700 scale-110 animate-bounce"
                    : "border-gray-400 text-gray-600 hover:border-blue-400"
            }`}
        >
            {facilityName}
        </div>
    );
};

export default BasicMarkerOverlay;