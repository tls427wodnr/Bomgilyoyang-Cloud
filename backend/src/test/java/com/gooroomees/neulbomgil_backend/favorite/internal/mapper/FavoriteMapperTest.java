package com.gooroomees.neulbomgil_backend.favorite.internal.mapper;

import com.gooroomees.neulbomgil_backend.facility.internal.service.FacilityDataInitService;
import com.gooroomees.neulbomgil_backend.facility.internal.service.ParkDataInitService;
import com.gooroomees.neulbomgil_backend.favorite.internal.entity.Favorite;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional(transactionManager = "favoriteTransactionManager")
class FavoriteMapperTest {

    @Autowired
    private FavoriteMapper favoriteMapper;

    @MockitoBean
    private ParkDataInitService parkDataInitService;

    @MockitoBean
    private FacilityDataInitService facilityDataInitService;

    @Test
    @DisplayName("즐겨찾기 Mapper의 등록, 조회, 삭제 SQL이 정상 동작한다")
    void crud() {
        Favorite favorite = Favorite.builder()
                .userId(100L)
                .facilityId("facility-1")
                .build();

        int insertedCount = favoriteMapper.insert(favorite);

        assertThat(insertedCount).isOne();
        assertThat(favorite.getId()).isNotNull();

        Optional<Favorite> found = favoriteMapper.findByUserIdAndFacilityId(100L, "facility-1");
        assertThat(found).isPresent();
        assertThat(found.orElseThrow().getId()).isEqualTo(favorite.getId());

        List<Favorite> favorites = favoriteMapper.findAllByUserId(100L);
        assertThat(favorites)
                .extracting(Favorite::getFacilityId)
                .containsExactly("facility-1");

        int deletedCount = favoriteMapper.deleteByUserIdAndFacilityId(100L, "facility-1");
        assertThat(deletedCount).isOne();
        assertThat(favoriteMapper.findByUserIdAndFacilityId(100L, "facility-1")).isEmpty();
    }
}
