package com.gooroomees.neulbomgil_backend.favorite.internal.service;

import com.gooroomees.neulbomgil_backend.favorite.internal.dto.request.FavoriteDeleteRequest;
import com.gooroomees.neulbomgil_backend.favorite.internal.dto.request.FavoriteRequest;
import com.gooroomees.neulbomgil_backend.favorite.internal.dto.response.FavoriteResponse;
import com.gooroomees.neulbomgil_backend.favorite.internal.entity.Favorite;
import com.gooroomees.neulbomgil_backend.favorite.internal.mapper.FavoriteMapper;
import com.gooroomees.neulbomgil_backend.facility.FacilityLookup;
import com.gooroomees.neulbomgil_backend.facility.FacilitySummary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FavoriteService {

    private final FavoriteMapper favoriteMapper;
    private final FacilityLookup facilityLookup;

    @Transactional
    public Long saveFavorite(Long userId, FavoriteRequest request) {
        favoriteMapper.findByUserIdAndFacilityId(userId, request.getFacilityId())
                .ifPresent(f -> {
                    throw new IllegalStateException("이미 즐겨찾기한 시설입니다.");
                });

        Favorite favorite = Favorite.builder()
                .userId(userId)
                .facilityId(request.getFacilityId())
                .build();

        int insertedCount = favoriteMapper.insert(favorite);
        if (insertedCount != 1 || favorite.getId() == null) {
            throw new IllegalStateException("즐겨찾기 저장에 실패했습니다.");
        }

        return favorite.getId();
    }

    public List<FavoriteResponse> getUserFavoritesWithDetail(Long userId) {
        List<Favorite> favorites = favoriteMapper.findAllByUserId(userId);
        List<String> facilityIds = favorites.stream()
                .map(Favorite::getFacilityId)
                .distinct()
                .toList();
        Map<String, FacilitySummary> facilityMap = facilityLookup.findAllByIds(facilityIds);

        return favorites.stream()
                .map(favorite -> FavoriteResponse.builder()
                        .id(favorite.getId())
                        .userId(favorite.getUserId())
                        .facilityId(favorite.getFacilityId())
                        .facility(facilityMap.get(favorite.getFacilityId()))
                        .build())
                .toList();
    }

    @Transactional
    public void deleteFavorite(Long userId, FavoriteDeleteRequest request) {
        favoriteMapper.deleteByUserIdAndFacilityId(userId, request.getFacilityId());
    }
}
