package com.gooroomees.neulbomgil_backend.identity.internal.security;

import com.gooroomees.neulbomgil_backend.identity.AuthenticatedUser;
import com.gooroomees.neulbomgil_backend.identity.internal.entity.UserAuth;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtProvider jwtProvider;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String accessToken = getCookieValue(request, "accessToken");
        if (accessToken == null) {
            accessToken = getBearerToken(request);
        }

        if (accessToken != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            authenticate(accessToken, request);
        }

        filterChain.doFilter(request, response);
    }

    private void authenticate(String accessToken, HttpServletRequest request) {
        try {
            String email = jwtProvider.extractUsername(accessToken);
            UserAuth user = (UserAuth) userDetailsService.loadUserByUsername(email);

            if (!jwtProvider.isTokenValid(accessToken, user)) {
                return;
            }

            AuthenticatedUser principal = new AuthenticatedUser(
                    user.getUserId(),
                    user.getEmail(),
                    user.getName(),
                    user.getRole().name()
            );
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(principal, null, user.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (RuntimeException ignored) {
            SecurityContextHolder.clearContext();
        }
    }

    private String getBearerToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

    private String getCookieValue(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {
            if (cookieName.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
