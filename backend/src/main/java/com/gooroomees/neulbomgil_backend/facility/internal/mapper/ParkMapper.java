package com.gooroomees.neulbomgil_backend.facility.internal.mapper;

import com.gooroomees.neulbomgil_backend.facility.internal.entity.Park;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface ParkMapper {

    int deleteAll();

    List<Park> findNearbyParks(
            @Param("lat") Double lat,
            @Param("lon") Double lon,
            @Param("radius") Double radius
    );

    Map<String, Object> getParkStatsWithinRadius(
            @Param("lat") double lat,
            @Param("lon") double lon
    );
}
