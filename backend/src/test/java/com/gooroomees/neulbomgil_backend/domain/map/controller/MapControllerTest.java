package com.gooroomees.neulbomgil_backend.domain.map.controller;

import com.gooroomees.neulbomgil_backend.domain.auth.repository.RefreshTokenRepository;
import com.gooroomees.neulbomgil_backend.domain.map.dto.request.FacilitySearchRequest;
import com.gooroomees.neulbomgil_backend.domain.map.dto.request.MarkerRequest;
import com.gooroomees.neulbomgil_backend.domain.map.dto.request.NearbyParkRequest;
import com.gooroomees.neulbomgil_backend.domain.map.dto.response.FacilityDetailResponse;
import com.gooroomees.neulbomgil_backend.domain.map.dto.response.FacilityMarkerResponse;
import com.gooroomees.neulbomgil_backend.domain.map.dto.response.FacilityResponse;
import com.gooroomees.neulbomgil_backend.domain.map.dto.response.NearParkResponse;
import com.gooroomees.neulbomgil_backend.domain.map.service.MapService;
import com.gooroomees.neulbomgil_backend.global.config.JwtAuthenticationFilter;
import com.gooroomees.neulbomgil_backend.global.config.JwtProvider;
import com.gooroomees.neulbomgil_backend.global.config.SecurityConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(
        controllers = MapController.class,
        excludeFilters = {
                @ComponentScan.Filter(
                        type = FilterType.ASSIGNABLE_TYPE,
                        classes = {SecurityConfig.class, JwtAuthenticationFilter.class}
                )
        }
)
@WithMockUser
class MapControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MapService mapService;

    @MockitoBean
    private JwtProvider jwtProvider;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private RefreshTokenRepository refreshTokenRepository;

    @Test
    @DisplayName("지도 시설 마커 조회 - 성공")
    void getFacilityMarkers_Success() throws Exception {
        // given
        FacilityMarkerResponse response = FacilityMarkerResponse.builder()
                .id("fac_01")
                .facilityName("늘봄 요양원")
                .newAddress("경기도 안양시 동안구")
                .longitude(126.9780)
                .latitude(37.5665)
                .build();

        given(mapService.getFacilityMarkers(any(MarkerRequest.class))).willReturn(List.of(response));

        // when & then
        mockMvc.perform(get("/api/map/facilities/markers")
                        .param("latitude", "37.5665")
                        .param("longitude", "126.9780")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("fac_01"))
                .andExpect(jsonPath("$[0].facilityName").value("늘봄 요양원"))
                .andExpect(jsonPath("$[0].longitude").value(126.9780))
                .andExpect(jsonPath("$[0].latitude").value(37.5665));
    }

    @Test
    @DisplayName("시설 목록 조회 - 성공")
    void getFacilities_Success() throws Exception {
        // given
        FacilityResponse response = Mockito.mock(FacilityResponse.class);
        given(mapService.getFacilities(any(FacilitySearchRequest.class))).willReturn(List.of(response));

        // when & then
        mockMvc.perform(get("/api/map/facilities")
                        .param("lastId", "10")
                        .param("distance", "1500")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("특정 시설 상세정보 조회 - 성공")
    void getFacilityDetail_Success() throws Exception {
        // given
        String facilityId = "fac_01";
        FacilityDetailResponse response = FacilityDetailResponse.builder()
                .id(facilityId)
                .facilityName("늘봄 요양원")
                .facilityTel("031-123-4567")
                .categoryName("노인요양시설")
                .oldAddress("경기도 안양시 동안구 비산동")
                .newAddress("경기도 안양시 동안구 관악대로")
                .longitude(126.9780)
                .latitude(37.5665)
                .facilityScore(95)
                .facilityImage("https://image.bomgil.com/fac_01.png")
                .capacityCnt(50)
                .currentCnt(42)
                .build();

        given(mapService.getFacilityDetail(facilityId)).willReturn(response);

        // when & then
        mockMvc.perform(get("/api/map/facilities/{facilityId}", facilityId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(facilityId))
                .andExpect(jsonPath("$.facilityName").value("늘봄 요양원"))
                .andExpect(jsonPath("$.facilityScore").value(95))
                .andExpect(jsonPath("$.capacityCnt").value(50))
                .andExpect(jsonPath("$.currentCnt").value(42));
    }

    @Test
    @DisplayName("특정 시설 상세정보 조회 - 존재하지 않는 시설 (404 Not Found)")
    void getFacilityDetail_NotFound() throws Exception {
        // given
        String facilityId = "invalid_id";
        given(mapService.getFacilityDetail(facilityId)).willThrow(new IllegalArgumentException("시설을 찾을 수 없습니다."));

        // when & then
        mockMvc.perform(get("/api/map/facilities/{facilityId}", facilityId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("특정 시설 일정 거리내에 있는 공원들 조회 - 성공")
    void getNearbyParks_Success() throws Exception {
        // given
        String facilityId = "fac_01";
        NearParkResponse response = NearParkResponse.builder()
                .id(100L)
                .name("중앙공원")
                .category("근린공원")
                .lotAddress("경기도 안양시 동안구 평촌동")
                .latitude(37.3942)
                .longitude(126.9568)
                .area(12000.50)
                .build();

        given(mapService.getNearbyParks(any(NearbyParkRequest.class))).willReturn(List.of(response));

        // when & then
        mockMvc.perform(get("/api/map/facilities/markers/{facilityId}/nearby-parks", facilityId)
                        .param("radius", "3.0")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(100))
                .andExpect(jsonPath("$[0].name").value("중앙공원"))
                .andExpect(jsonPath("$[0].area").value(12000.50));
    }
}