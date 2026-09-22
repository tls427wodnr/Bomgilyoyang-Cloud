package com.gooroomees.neulbomgil_backend.domain.admin.service;

import com.gooroomees.neulbomgil_backend.domain.admin.dto.AdminUserResponseDto;
import com.gooroomees.neulbomgil_backend.community.CommunityActivityCount;
import com.gooroomees.neulbomgil_backend.community.CommunityStatistics;
import com.gooroomees.neulbomgil_backend.identity.UserAdministration;
import com.gooroomees.neulbomgil_backend.identity.UserSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UserAdministration userAdministration;
    private final CommunityStatistics communityStatistics;


    public List<AdminUserResponseDto> getUsers() {
        List<UserSummary> users = userAdministration.findRegularUsers();

        List<AdminUserResponseDto> adminUserResponseDtoList = new ArrayList<>();
        for (UserSummary user : users) {
            CommunityActivityCount activityCount = communityStatistics.countByUserId(user.userId());

            adminUserResponseDtoList.add(
                    new AdminUserResponseDto(
                            user.userId(),
                            user.name(),
                            user.email(),
                            activityCount.boardCount(),
                            activityCount.replyCount(),
                            user.status(),
                            user.createdAt().toString()
                    )
            );
        }

        return adminUserResponseDtoList;
    }


    public List<AdminUserResponseDto> getDeletedUsers() {
        List<UserSummary> users = userAdministration.findRemovedUsers();

        List<AdminUserResponseDto> adminUserResponseDtoList = new ArrayList<>();
        for (UserSummary user : users) {
            CommunityActivityCount activityCount = communityStatistics.countByUserId(user.userId());

            adminUserResponseDtoList.add(
                    new AdminUserResponseDto(
                            user.userId(),
                            user.name(),
                            user.email(),
                            activityCount.boardCount(),
                            activityCount.replyCount(),
                            user.status(),
                            user.createdAt().toString()
                    )
            );
        }

        return adminUserResponseDtoList;
    }
    @Transactional
    public void updateUserStatus(Long userId) {
        userAdministration.toggleStatus(userId);
    }


}
