package com.gooroomees.neulbomgil_backend.favorite.internal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gooroomees.neulbomgil_backend.identity.AuthenticatedUser;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.TestSecurityContextHolder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.testSecurityContext;
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
@Import(FavoriteControllerTest.AuthenticatedUserArgumentResolverConfig.class)
class FavoriteControllerTest {

    @TestConfiguration
    static class AuthenticatedUserArgumentResolverConfig implements WebMvcConfigurer {

        @Override
        public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
            resolvers.add(new HandlerMethodArgumentResolver() {
                @Override
                public boolean supportsParameter(MethodParameter parameter) {
                    return parameter.hasParameterAnnotation(AuthenticationPrincipal.class)
                            && parameter.getParameterType().equals(AuthenticatedUser.class);
                }

                @Override
                public Object resolveArgument(
                        MethodParameter parameter,
                        ModelAndViewContainer mavContainer,
                        NativeWebRequest webRequest,
                        org.springframework.web.bind.support.WebDataBinderFactory binderFactory
                ) {
                    return new AuthenticatedUser(100L, "user@example.com", "테스트 사용자", "USER");
                }
            });
        }
    }

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

    private AuthenticatedUser authenticatedUser() {
        return new AuthenticatedUser(100L, "user@example.com", "테스트 사용자", "USER");
    }

    @BeforeEach
    void setUpAuthentication() {
        TestSecurityContextHolder.setAuthentication(new UsernamePasswordAuthenticationToken(
                authenticatedUser(),
                null,
                List.of(new SimpleGrantedAuthority("USER"))
        ));
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
                        .with(testSecurityContext())
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
                        .with(testSecurityContext())
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
                        .with(testSecurityContext())
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
                        .with(testSecurityContext())
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
                        .with(testSecurityContext())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest()); // 400 Bad Request
    }
}
