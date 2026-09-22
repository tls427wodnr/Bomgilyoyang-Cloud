package com.gooroomees.neulbomgil_backend.facility;

public record FacilitySummary(
        String id,
        String facilityName,
        String facilityTel,
        String categoryName,
        String oldAddress,
        String newAddress,
        Double longitude,
        Double latitude,
        Integer facilityScore,
        String facilityImage,
        Integer capacityCnt,
        Integer currentCnt
) {
}
