package com.gooroomees.neulbomgil_backend.facility.internal.repository;

import com.gooroomees.neulbomgil_backend.facility.internal.dto.request.FacilitySearchRequest;
import com.gooroomees.neulbomgil_backend.facility.internal.dto.response.FacilityResponse;

import java.util.List;

public interface FacilityRepositoryCustom {
    List<FacilityResponse> searchByRegionCursor(FacilitySearchRequest request);
}
