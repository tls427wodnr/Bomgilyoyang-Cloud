import React from 'react';

import scoreTrue from '../../../assets/images/icons/score-true.png';
import scoreFalse from '../../../assets/images/icons/score-false.png';

const FacilityItem = React.forwardRef(({item, isSelected, onClick}, ref) => {
    const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const score = item.facilityScore || 0;

    const bgClass = isSelected
        ? 'bg-bg-soft border-green-400'
        : 'bg-white border-gray-100 hover:border-blue-200';

    return (
        <div
            ref={ref}
            onClick={onClick}
            data-id={item.id}
            className={`facility-item p-3 rounded-xl border ${bgClass} shadow-sm transition-all cursor-pointer group flex gap-3`}
        >
            <div className="facility-item__image-frame shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-50">
                <img
                    src={`${IMAGE_BASE_URL}${item.facilityImage}`}
                    alt={item.facilityName}
                    className="facility-item__image w-full h-full object-cover transition-transform group-hover:scale-110"
                />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-sm truncate text-gray-800">
                        {item.facilityName}
                    </h3>
                    <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-md shrink-0">
                        {item.distance ? item.distance.toFixed(1) : 0}km
                    </span>
                </div>

                <div className="flex items-center gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => {
                        const isTrue = i < score;
                        return (
                            <img
                                key={i}
                                src={isTrue ? scoreTrue : scoreFalse}
                                alt={isTrue ? "추천별" : "빈별"}
                                className={
                                    isTrue
                                        ? "w-6 h-6 object-contain border border-transparent rounded-full"
                                        : "w-6 h-6 object-contain rounded-full"
                                }
                            />
                        );
                    })}
                </div>

                <div className="mt-2 space-y-1">
                    <p className="text-[11px] text-gray-500 flex items-start">
                        <span className="mr-1 text-blue-400 shrink-0">📍</span>
                        <span className="truncate">{item.newAddress}</span>
                    </p>

                    {item.facilityTel && (
                        <p className="text-[11px] text-gray-400 flex items-center">
                            <span className="mr-1 text-green-500 shrink-0">📞</span>
                            <span className="truncate">{item.facilityTel}</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
});

export default React.memo(FacilityItem);
