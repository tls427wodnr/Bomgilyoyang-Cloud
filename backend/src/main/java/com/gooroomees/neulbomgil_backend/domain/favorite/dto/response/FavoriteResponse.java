package com.gooroomees.neulbomgil_backend.domain.favorite.dto.response;

import com.gooroomees.neulbomgil_backend.facility.FacilitySummary;
import lombok.Builder;

@Builder
public record FavoriteResponse(
        Long id,
        Long userId,
        String facilityId,
        FacilitySummary facility
) {
}
