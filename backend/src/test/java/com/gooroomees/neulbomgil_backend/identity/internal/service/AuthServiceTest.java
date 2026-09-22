package com.gooroomees.neulbomgil_backend.identity.internal.service;

import com.gooroomees.neulbomgil_backend.identity.internal.dto.request.LoginRequest;
import com.gooroomees.neulbomgil_backend.identity.internal.dto.response.JwtTokenResponse;
import com.gooroomees.neulbomgil_backend.identity.internal.entity.Role;
import com.gooroomees.neulbomgil_backend.identity.internal.entity.Status;
import com.gooroomees.neulbomgil_backend.identity.internal.entity.UserAuth;
import com.gooroomees.neulbomgil_backend.identity.internal.repository.RefreshTokenRedisRepository;
import com.gooroomees.neulbomgil_backend.identity.internal.repository.UserAuthRepository;
import com.gooroomees.neulbomgil_backend.identity.internal.security.JwtProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Duration;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    private static final long REFRESH_TOKEN_EXPIRATION = 604_800_000L;

    @Mock
    private UserAuthRepository userAuthRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtProvider jwtProvider;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserAuthService userAuthService;

    @Mock
    private RefreshTokenRedisRepository refreshTokenRedisRepository;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "refreshTokenExpiration", REFRESH_TOKEN_EXPIRATION);
    }

    @Test
    void loginStoresRefreshTokenInRedisWithTtl() {
        LoginRequest request = new LoginRequest("user@example.com", "password");
        UserAuth user = activeUser();
        given(userAuthRepository.findByEmail(request.getEmail())).willReturn(Optional.of(user));
        given(jwtProvider.generateAccessToken(user)).willReturn("access-token");
        given(jwtProvider.generateRefreshToken(user)).willReturn("refresh-token");

        JwtTokenResponse response = authService.login(request);

        verify(authenticationManager).authenticate(any());
        verify(refreshTokenRedisRepository).save(
                user.getUserId(),
                "refresh-token",
                Duration.ofMillis(REFRESH_TOKEN_EXPIRATION)
        );
        assertThat(response.getAccessToken()).isEqualTo("access-token");
        assertThat(response.getRefreshToken()).isEqualTo("refresh-token");
    }

    @Test
    void createNewAccessTokenUsesMatchingRedisToken() {
        UserAuth user = activeUser();
        given(jwtProvider.isTokenValid("refresh-token")).willReturn(true);
        given(jwtProvider.isRefreshToken("refresh-token")).willReturn(true);
        given(jwtProvider.extractUserId("refresh-token")).willReturn(user.getUserId());
        given(refreshTokenRedisRepository.findByUserId(user.getUserId()))
                .willReturn(Optional.of("refresh-token"));
        given(userAuthService.findById(user.getUserId())).willReturn(user);
        given(jwtProvider.generateAccessToken(user)).willReturn("new-access-token");

        String accessToken = authService.createNewAccessToken("refresh-token");

        assertThat(accessToken).isEqualTo("new-access-token");
    }

    @Test
    void createNewAccessTokenRejectsTokenThatDoesNotMatchRedis() {
        given(jwtProvider.isTokenValid("refresh-token")).willReturn(true);
        given(jwtProvider.isRefreshToken("refresh-token")).willReturn(true);
        given(jwtProvider.extractUserId("refresh-token")).willReturn(1L);
        given(refreshTokenRedisRepository.findByUserId(1L))
                .willReturn(Optional.of("different-refresh-token"));

        assertThatThrownBy(() -> authService.createNewAccessToken("refresh-token"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("일치하지 않는 Refresh 토큰입니다.");
        verify(userAuthService, never()).findById(any());
    }

    private UserAuth activeUser() {
        return UserAuth.builder()
                .userId(1L)
                .email("user@example.com")
                .password("encoded-password")
                .name("사용자")
                .role(Role.USER)
                .status(Status.ACTIVE)
                .build();
    }
}
