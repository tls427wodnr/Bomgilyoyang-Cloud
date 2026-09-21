package com.gooroomees.neulbomgil_backend.domain.auth.service;

import com.gooroomees.neulbomgil_backend.domain.auth.dto.request.LoginRequest;
import com.gooroomees.neulbomgil_backend.domain.auth.dto.request.PasswordChangeRequest;
import com.gooroomees.neulbomgil_backend.domain.auth.dto.request.RegisterRequest;
import com.gooroomees.neulbomgil_backend.domain.auth.dto.request.UpdateUserRequest;
import com.gooroomees.neulbomgil_backend.domain.auth.dto.request.WithdrawRequest;
import com.gooroomees.neulbomgil_backend.domain.auth.dto.response.JwtTokenResponse;
import com.gooroomees.neulbomgil_backend.domain.auth.entity.RefreshToken;
import com.gooroomees.neulbomgil_backend.domain.auth.entity.Role;
import com.gooroomees.neulbomgil_backend.domain.auth.entity.Status;
import com.gooroomees.neulbomgil_backend.domain.auth.entity.UserAuth;
import com.gooroomees.neulbomgil_backend.domain.auth.repository.RefreshTokenRepository;
import com.gooroomees.neulbomgil_backend.domain.auth.repository.UserAuthRepository;
import com.gooroomees.neulbomgil_backend.global.config.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final RefreshTokenService refreshTokenService;
    private final UserAuthRepository userAuthRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final UserAuthService userAuthService;
    private final RefreshTokenRepository refreshTokenRepository;

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

        refreshTokenRepository.findByUserId(user.getUserId())
                .ifPresentOrElse(
                        token -> token.update(refreshToken),
                        () -> refreshTokenRepository.save(new RefreshToken(user.getUserId(), refreshToken))
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
        refreshTokenRepository.findByUserId(userId).ifPresent(refreshTokenRepository::delete);
    }

    public String createNewAccessToken(String refreshToken) {
        if (!jwtProvider.isTokenValid(refreshToken) || !jwtProvider.isRefreshToken(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않은 Refresh Token입니다.");
        }

        Long userId = refreshTokenService.findByRefreshToken(refreshToken).getUserId();
        UserAuth user = userAuthService.findById(userId);
        return jwtProvider.generateAccessToken(user);
    }

    @Transactional
    public boolean changePassword(UserAuth user, PasswordChangeRequest request) {
        if (user == null) {
            return false;
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), request.getOldPassword())
            );
        } catch (AuthenticationException exception) {
            return false;
        }

        UserAuth savedUser = userAuthRepository.findById(user.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        savedUser.changePassword(passwordEncoder.encode(request.getNewPassword()));
        return true;
    }

    @Transactional
    public void deleteUser(Long userId) {
        UserAuth user = userAuthRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        user.deleteUser();
        refreshTokenRepository.findByUserId(userId).ifPresent(refreshTokenRepository::delete);
    }

    @Transactional
    public void updateUserInfo(UserAuth user, UpdateUserRequest request) {
        UserAuth savedUser = userAuthRepository.findById(user.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        savedUser.updateName(request.getName());
    }

    @Transactional
    public boolean withdraw(UserAuth user, WithdrawRequest request) {
        UserAuth savedUser = userAuthRepository.findById(user.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        if (!passwordEncoder.matches(request.getPassword(), savedUser.getPassword())) {
            return false;
        }

        savedUser.deleteUser();
        refreshTokenRepository.findByUserId(savedUser.getUserId()).ifPresent(refreshTokenRepository::delete);
        return true;
    }
}
