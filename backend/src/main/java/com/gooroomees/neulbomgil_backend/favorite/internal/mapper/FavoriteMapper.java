package com.gooroomees.neulbomgil_backend.favorite.internal.mapper;

import com.gooroomees.neulbomgil_backend.favorite.internal.entity.Favorite;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface FavoriteMapper {

    int insert(Favorite favorite);

    List<Favorite> findAllByUserId(@Param("userId") Long userId);

    Optional<Favorite> findByUserIdAndFacilityId(
            @Param("userId") Long userId,
            @Param("facilityId") String facilityId
    );

    int deleteByUserIdAndFacilityId(
            @Param("userId") Long userId,
            @Param("facilityId") String facilityId
    );
}
