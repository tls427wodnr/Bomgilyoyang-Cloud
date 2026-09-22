package com.gooroomees.neulbomgil_backend.identity.internal.service;

import com.gooroomees.neulbomgil_backend.identity.internal.dto.request.LoginRequest;
import com.gooroomees.neulbomgil_backend.identity.internal.dto.request.PasswordChangeRequest;
import com.gooroomees.neulbomgil_backend.identity.internal.dto.request.RegisterRequest;
import com.gooroomees.neulbomgil_backend.identity.internal.dto.request.UpdateUserRequest;
import com.gooroomees.neulbomgil_backend.identity.internal.dto.request.WithdrawRequest;
import com.gooroomees.neulbomgil_backend.identity.internal.dto.response.JwtTokenResponse;
import com.gooroomees.neulbomgil_backend.identity.internal.entity.Role;
import com.gooroomees.neulbomgil_backend.identity.internal.entity.Status;
import com.gooroomees.neulbomgil_backend.identity.internal.entity.UserAuth;
import com.gooroomees.neulbomgil_backend.identity.internal.repository.RefreshTokenRedisRepository;
import com.gooroomees.neulbomgil_backend.identity.internal.repository.UserAuthRepository;
import com.gooroomees.neulbomgil_backend.identity.internal.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserAuthRepository userAuthRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final UserAuthService userAuthService;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;

    @Value("${application.security.jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    @Transactional
    public String register(RegisterRequest request) {
        if (userAuthRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        UserAuth user = UserAuth.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role(Role.USER)
                .status(Status.ACTIVE)
                .build();
        userAuthRepository.save(user);

        return "회원가입이 완료되었습니다.";
    }

    public boolean isEmailDuplicated(String email) {
        return userAuthRepository.existsByEmail(email);
    }

    @Transactional
    public JwtTokenResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserAuth user = userAuthRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (user.getStatus() != Status.ACTIVE) {
            throw new IllegalStateException("사용할 수 없는 계정입니다.");
        }

        String accessToken = jwtProvider.generateAccessToken(user);
        String refreshToken = jwtProvider.generateRefreshToken(user);

        refreshTokenRedisRepository.save(
                user.getUserId(),
                refreshToken,
                Duration.ofMillis(refreshTokenExpiration)
        );

        return JwtTokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Transactional
    public void logout(String refreshToken) {
        if (!jwtProvider.isTokenValid(refreshToken) || !jwtProvider.isRefreshToken(refreshToken)) {
            return;
        }

        Long userId = jwtProvider.extractUserId(refreshToken);
        refreshTokenRedisRepository.findByUserId(userId)
                .filter(savedToken -> tokensMatch(savedToken, refreshToken))
                .ifPresent(savedToken -> refreshTokenRedisRepository.deleteByUserId(userId));
    }

    public String createNewAccessToken(String refreshToken) {
        if (!jwtProvider.isTokenValid(refreshToken) || !jwtProvider.isRefreshToken(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않은 Refresh Token입니다.");
        }

        Long userId = jwtProvider.extractUserId(refreshToken);
        String savedToken = refreshTokenRedisRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 Refresh 토큰입니다."));

        if (!tokensMatch(savedToken, refreshToken)) {
            throw new IllegalArgumentException("일치하지 않는 Refresh 토큰입니다.");
        }

        UserAuth user = userAuthService.findById(userId);
        return jwtProvider.generateAccessToken(user);
    }

    @Transactional
    public boolean changePassword(Long userId, PasswordChangeRequest request) {
        if (userId == null) {
            return false;
        }

        UserAuth savedUser = userAuthRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(savedUser.getEmail(), request.getOldPassword())
            );
        } catch (AuthenticationException exception) {
            return false;
        }

        savedUser.changePassword(passwordEncoder.encode(request.getNewPassword()));
        return true;
    }

    @Transactional
    public void deleteUser(Long userId) {
        UserAuth user = userAuthRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        user.deleteUser();
        refreshTokenRedisRepository.deleteByUserId(userId);
    }

    @Transactional
    public void updateUserInfo(Long userId, UpdateUserRequest request) {
        UserAuth savedUser = userAuthRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        savedUser.updateName(request.getName());
    }

    @Transactional
    public boolean withdraw(Long userId, WithdrawRequest request) {
        UserAuth savedUser = userAuthRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        if (!passwordEncoder.matches(request.getPassword(), savedUser.getPassword())) {
            return false;
        }

        savedUser.deleteUser();
        refreshTokenRedisRepository.deleteByUserId(savedUser.getUserId());
        return true;
    }

    private boolean tokensMatch(String savedToken, String presentedToken) {
        return MessageDigest.isEqual(
                savedToken.getBytes(StandardCharsets.UTF_8),
                presentedToken.getBytes(StandardCharsets.UTF_8)
        );
    }
}
