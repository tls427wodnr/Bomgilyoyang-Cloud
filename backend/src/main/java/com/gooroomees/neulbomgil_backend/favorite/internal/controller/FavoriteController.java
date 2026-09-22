package com.gooroomees.neulbomgil_backend.favorite.internal.controller;

import com.gooroomees.neulbomgil_backend.identity.AuthenticatedUser;
import com.gooroomees.neulbomgil_backend.favorite.internal.dto.request.FavoriteDeleteRequest;
import com.gooroomees.neulbomgil_backend.favorite.internal.dto.request.FavoriteRequest;
import com.gooroomees.neulbomgil_backend.favorite.internal.dto.response.FavoriteResponse;
import com.gooroomees.neulbomgil_backend.favorite.internal.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @Operation(
            summary = "즐겨찾기 추가"
    )
    @PostMapping
    public ResponseEntity<Long> addFavorite(
            @AuthenticationPrincipal AuthenticatedUser user,
            @Valid @RequestBody FavoriteRequest request) {
        if (user == null || user.userId() == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(favoriteService.saveFavorite(user.userId(), request));
    }

    @Operation(
            summary = "특정 사용자의 즐겨찾기 시설 조회"
    )
    @GetMapping("/me")
    public ResponseEntity<List<FavoriteResponse>> getFavorites(
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        if (user == null || user.userId() == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(favoriteService.getUserFavoritesWithDetail(user.userId()));
    }

    @Operation(
            summary = "즐겨찾기 삭제"
    )
    @DeleteMapping("/me")
    public ResponseEntity<Void> removeFavorite(
            @AuthenticationPrincipal AuthenticatedUser user,
            @Valid @RequestBody FavoriteDeleteRequest request) {
        if (user == null || user.userId() == null) {
            return ResponseEntity.status(401).build();
        }
        favoriteService.deleteFavorite(user.userId(), request);
        return ResponseEntity.noContent().build();
    }
}
