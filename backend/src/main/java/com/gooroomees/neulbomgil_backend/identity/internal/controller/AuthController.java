package com.gooroomees.neulbomgil_backend.identity.internal.controller;

import com.gooroomees.neulbomgil_backend.identity.internal.dto.request.LoginRequest;
import com.gooroomees.neulbomgil_backend.identity.internal.dto.request.PasswordChangeRequest;
import com.gooroomees.neulbomgil_backend.identity.internal.dto.request.RegisterRequest;
import com.gooroomees.neulbomgil_backend.identity.internal.dto.request.UpdateUserRequest;
import com.gooroomees.neulbomgil_backend.identity.internal.dto.request.WithdrawRequest;
import com.gooroomees.neulbomgil_backend.identity.internal.dto.response.JwtTokenResponse;
import com.gooroomees.neulbomgil_backend.identity.internal.dto.response.UserResponse;
import com.gooroomees.neulbomgil_backend.identity.UserAuth;
import com.gooroomees.neulbomgil_backend.identity.internal.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@Tag(name = "인증 및 인가 관리", description = "JWT 기반 회원가입 및 로그인 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private static final Duration ACCESS_TOKEN_AGE = Duration.ofMinutes(30);
    private static final Duration REFRESH_TOKEN_AGE = Duration.ofDays(7);

    private final AuthService authService;

    @Value("${application.security.cookie.secure:false}")
    private boolean secureCookie;

    @Operation(summary = "회원 가입")
    @PostMapping("/signup")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(authService.register(request));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(exception.getMessage());
        }
    }

    @Operation(summary = "이메일 중복 확인")
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam("email") String email) {
        return ResponseEntity.ok(authService.isEmailDuplicated(email));
    }

    @Operation(summary = "현재 로그인한 사용자 정보 조회")
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyInfo(@AuthenticationPrincipal UserAuth user) {
        return ResponseEntity.ok(UserResponse.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .build());
    }

    @Operation(summary = "일반 로그인")
    @PostMapping("/login")
    public ResponseEntity<Void> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        try {
            JwtTokenResponse tokens = authService.login(request);
            addTokenCookies(response, tokens.getAccessToken(), tokens.getRefreshToken());
            return ResponseEntity.noContent().build();
        } catch (AuthenticationException | IllegalArgumentException | IllegalStateException exception) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @Operation(summary = "로그아웃")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response
    ) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            authService.logout(refreshToken);
        }
        clearTokenCookies(response);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "액세스 토큰 재발급")
    @PostMapping("/refresh")
    public ResponseEntity<Void> refresh(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response
    ) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            String accessToken = authService.createNewAccessToken(refreshToken);
            response.addHeader(HttpHeaders.SET_COOKIE, tokenCookie("accessToken", accessToken, ACCESS_TOKEN_AGE).toString());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException exception) {
            clearTokenCookies(response);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @Operation(summary = "비밀번호 변경")
    @PostMapping("/password/change")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal UserAuth user,
            @RequestBody PasswordChangeRequest request
    ) {
        if (authService.changePassword(user, request)) {
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        }
        return ResponseEntity.badRequest().body("현재 비밀번호가 일치하지 않습니다.");
    }

    @Operation(summary = "사용자 삭제")
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteUser(@AuthenticationPrincipal UserAuth user, HttpServletResponse response) {
        authService.deleteUser(user.getUserId());
        clearTokenCookies(response);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "회원 정보 수정")
    @PostMapping("/update")
    public ResponseEntity<String> updateUserInfo(
            @AuthenticationPrincipal UserAuth user,
            @RequestBody UpdateUserRequest request
    ) {
        authService.updateUserInfo(user, request);
        return ResponseEntity.ok("회원 정보가 성공적으로 수정되었습니다.");
    }

    @Operation(summary = "회원 탈퇴")
    @PostMapping("/withdraw")
    public ResponseEntity<String> withdraw(
            @AuthenticationPrincipal UserAuth user,
            @RequestBody WithdrawRequest request,
            HttpServletResponse response
    ) {
        if (!authService.withdraw(user, request)) {
            return ResponseEntity.badRequest().body("비밀번호가 일치하지 않습니다.");
        }
        clearTokenCookies(response);
        return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
    }

    private void addTokenCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        response.addHeader(HttpHeaders.SET_COOKIE, tokenCookie("accessToken", accessToken, ACCESS_TOKEN_AGE).toString());
        response.addHeader(HttpHeaders.SET_COOKIE, tokenCookie("refreshToken", refreshToken, REFRESH_TOKEN_AGE).toString());
    }

    private void clearTokenCookies(HttpServletResponse response) {
        response.addHeader(HttpHeaders.SET_COOKIE, tokenCookie("accessToken", "", Duration.ZERO).toString());
        response.addHeader(HttpHeaders.SET_COOKIE, tokenCookie("refreshToken", "", Duration.ZERO).toString());
    }

    private ResponseCookie tokenCookie(String name, String value, Duration maxAge) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Lax")
                .path("/")
                .maxAge(maxAge)
                .build();
    }
}
