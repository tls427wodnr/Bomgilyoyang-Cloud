package com.gooroomees.neulbomgil_backend.domain.admin.controller;

import com.gooroomees.neulbomgil_backend.domain.admin.dto.AdminUserResponseDto;
import com.gooroomees.neulbomgil_backend.domain.admin.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "관리자페이지", description = "전체회원, 탈퇴회원, 상태처리 API")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @Operation(
            summary = "전체 사용자 조회",
            description = "전체 사용자 목록을 조회합니다."
    )
    @GetMapping("/users")
    public List<AdminUserResponseDto> getUsers() {
        return adminService.getUsers();
    }

    @Operation(
            summary = "탈퇴 사용자 조회",
            description = "탈퇴 상태의 사용자 목록을 조회합니다."
    )
    @GetMapping("/users/deleted")
    public List<AdminUserResponseDto> getDeletedUsers() {
        return adminService.getDeletedUsers();
    }


    @Operation(
            summary = "사용자 상태 변경",
            description = "활성  -> 탈퇴, 탈퇴->활성으로 사용자의 상태를 변경합니다."
    )
    @PatchMapping("/users/{userId}/status")
    public void updateUserStatus(@PathVariable Long userId) {
        adminService.updateUserStatus(userId);
    }

}
