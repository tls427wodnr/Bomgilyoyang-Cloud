package com.gooroomees.neulbomgil_backend.favorite.internal.service;

import com.gooroomees.neulbomgil_backend.facility.FacilityLookup;
import com.gooroomees.neulbomgil_backend.favorite.internal.dto.request.FavoriteDeleteRequest;
import com.gooroomees.neulbomgil_backend.favorite.internal.dto.request.FavoriteRequest;
import com.gooroomees.neulbomgil_backend.favorite.internal.entity.Favorite;
import com.gooroomees.neulbomgil_backend.favorite.internal.mapper.FavoriteMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {

    @Mock
    private FavoriteMapper favoriteMapper;

    @Mock
    private FacilityLookup facilityLookup;

    @InjectMocks
    private FavoriteService favoriteService;

    @Test
    @DisplayName("Mapper로 즐겨찾기를 저장하고 생성된 ID를 반환한다")
    void saveFavorite() {
        FavoriteRequest request = new FavoriteRequest();
        request.setFacilityId("facility-1");

        given(favoriteMapper.findByUserIdAndFacilityId(100L, "facility-1"))
                .willReturn(Optional.empty());
        given(favoriteMapper.insert(any(Favorite.class)))
                .willAnswer(invocation -> {
                    Favorite favorite = invocation.getArgument(0);
                    favorite.setId(1L);
                    return 1;
                });

        Long favoriteId = favoriteService.saveFavorite(100L, request);

        assertThat(favoriteId).isEqualTo(1L);
    }

    @Test
    @DisplayName("이미 등록된 시설은 중복 저장하지 않는다")
    void rejectDuplicatedFavorite() {
        FavoriteRequest request = new FavoriteRequest();
        request.setFacilityId("facility-1");

        Favorite existing = Favorite.builder()
                .id(1L)
                .userId(100L)
                .facilityId("facility-1")
                .build();
        given(favoriteMapper.findByUserIdAndFacilityId(100L, "facility-1"))
                .willReturn(Optional.of(existing));

        assertThatThrownBy(() -> favoriteService.saveFavorite(100L, request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("이미 즐겨찾기한 시설입니다.");
        verify(favoriteMapper, never()).insert(any(Favorite.class));
    }

    @Test
    @DisplayName("Mapper로 사용자의 즐겨찾기를 삭제한다")
    void deleteFavorite() {
        FavoriteDeleteRequest request = new FavoriteDeleteRequest();
        request.setFacilityId("facility-1");

        favoriteService.deleteFavorite(100L, request);

        verify(favoriteMapper).deleteByUserIdAndFacilityId(100L, "facility-1");
    }
}
