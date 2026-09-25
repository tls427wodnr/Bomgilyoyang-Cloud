package com.gooroomees.neulbomgil_backend.facility.internal.mapper;

import com.gooroomees.neulbomgil_backend.facility.internal.dto.request.FacilitySearchRequest;
import com.gooroomees.neulbomgil_backend.facility.internal.dto.response.FacilityResponse;
import com.gooroomees.neulbomgil_backend.facility.internal.entity.Facility;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Mapper
public interface FacilityMapper {

    int upsert(Facility facility);

    Optional<Facility> findById(@Param("id") String id);

    List<Facility> findAllByIds(@Param("ids") Collection<String> ids);

    List<Facility> findFacilitiesWithinDistance(
            @Param("lat") Double lat,
            @Param("lon") Double lon,
            @Param("radius") Double radius
    );

    List<FacilityResponse> searchByRegionCursor(
            @Param("request") FacilitySearchRequest request
    );
}
