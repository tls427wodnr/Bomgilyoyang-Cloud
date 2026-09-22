package com.gooroomees.neulbomgil_backend.favorite.internal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gooroomees.neulbomgil_backend.identity.Role;
import com.gooroomees.neulbomgil_backend.identity.Status;
import com.gooroomees.neulbomgil_backend.identity.UserAuth;
import com.gooroomees.neulbomgil_backend.identity.internal.repository.RefreshTokenRepository;
import com.gooroomees.neulbomgil_backend.identity.internal.repository.UserAuthRepository;
import com.gooroomees.neulbomgil_backend.favorite.internal.dto.request.FavoriteDeleteRequest;
import com.gooroomees.neulbomgil_backend.favorite.internal.dto.request.FavoriteRequest;
import com.gooroomees.neulbomgil_backend.favorite.internal.dto.response.FavoriteResponse;
import com.gooroomees.neulbomgil_backend.favorite.internal.service.FavoriteService;
import com.gooroomees.neulbomgil_backend.facility.FacilitySummary;
import com.gooroomees.neulbomgil_backend.identity.internal.security.JwtAuthenticationFilter;
import com.gooroomees.neulbomgil_backend.identity.internal.security.JwtProvider;
import com.gooroomees.neulbomgil_backend.identity.internal.security.SecurityConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(
        controllers = FavoriteController.class,
        excludeFilters = {
                @ComponentScan.Filter(
                        type = FilterType.ASSIGNABLE_TYPE,
                        classes = {SecurityConfig.class, JwtAuthenticationFilter.class}
                )
        }
)
@WithMockUser
class FavoriteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private FavoriteService favoriteService;

    @MockitoBean
    private JwtProvider jwtProvider;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private RefreshTokenRepository refreshTokenRepository;

    @MockitoBean
    private UserAuthRepository userAuthRepository;

    private UserAuth authenticatedUser() {
        return UserAuth.builder()
                .userId(100L)
                .email("user@example.com")
                .password("password")
                .name("테스트 사용자")
                .role(Role.USER)
                .status(Status.ACTIVE)
                .build();
    }

    @Test
    @DisplayName("즐겨찾기 추가 - 성공")
    void addFavorite_Success() throws Exception {
        // given
        FavoriteRequest request = new FavoriteRequest();
        request.setFacilityId("fac_01");
        Long savedId = 1L;

        given(favoriteService.saveFavorite(any(), any(FavoriteRequest.class))).willReturn(savedId);

        // when & then
        mockMvc.perform(post("/api/favorites")
                        .with(csrf())
                        .with(user(authenticatedUser()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(savedId));
    }

    @Test
    @DisplayName("즐겨찾기 추가 - 실패 (시설 ID가 공백인 경우 400 에러)")
    void addFavorite_ValidationError() throws Exception {
        // given
        FavoriteRequest invalidRequest = new FavoriteRequest();
        invalidRequest.setFacilityId(" "); // @NotBlank 위반 조건

        // when & then
        mockMvc.perform(post("/api/favorites")
                        .with(csrf())
                        .with(user(authenticatedUser()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest()); // @Valid에 의해 400 Bad Request 발생
    }

    @Test
    @DisplayName("내 즐겨찾기 시설 목록 조회 - 성공")
    void getFavorites_Success() throws Exception {
        // given
        FacilitySummary mockFacility = new FacilitySummary(
                "fac_01",
                "늘봄 요양원",
                "031-123-4567",
                "노인요양시설",
                null,
                "경기도 안양시 동안구",
                null,
                null,
                5,
                null,
                50,
                42
        );

        FavoriteResponse response = FavoriteResponse.builder()
                .id(1L)
                .userId(100L)
                .facilityId("fac_01")
                .facility(mockFacility)
                .build();

        given(favoriteService.getUserFavoritesWithDetail(any())).willReturn(List.of(response));

        // when & then
        mockMvc.perform(get("/api/favorites/me")
                        .with(user(authenticatedUser()))
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].userId").value(100))
                .andExpect(jsonPath("$[0].facilityId").value("fac_01"))
                .andExpect(jsonPath("$[0].facility.id").value("fac_01"))
                .andExpect(jsonPath("$[0].facility.facilityName").value("늘봄 요양원"))
                .andExpect(jsonPath("$[0].facility.facilityScore").value(5))
                .andExpect(jsonPath("$[0].facility.capacityCnt").value(50));
    }

    @Test
    @DisplayName("즐겨찾기 삭제 - 성공")
    void removeFavorite_Success() throws Exception {
        // given
        FavoriteDeleteRequest request = new FavoriteDeleteRequest();
        request.setFacilityId("fac_01");

        willDoNothing().given(favoriteService).deleteFavorite(any(), any(FavoriteDeleteRequest.class));

        // when & then
        mockMvc.perform(delete("/api/favorites/me")
                        .with(csrf())
                        .with(user(authenticatedUser()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("즐겨찾기 삭제 - 실패 (시설 ID가 공백인 경우 400 에러)")
    void removeFavorite_ValidationError() throws Exception {
        // given
        FavoriteDeleteRequest invalidRequest = new FavoriteDeleteRequest();
        invalidRequest.setFacilityId(""); // @NotBlank 위반 조건

        // when & then
        mockMvc.perform(delete("/api/favorites/me")
                        .with(csrf())
                        .with(user(authenticatedUser()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest()); // 400 Bad Request
    }
}
