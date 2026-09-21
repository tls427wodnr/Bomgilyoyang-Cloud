package com.gooroomees.neulbomgil_backend.domain.admin.service;

import com.gooroomees.neulbomgil_backend.domain.admin.dto.AdminUserResponseDto;
import com.gooroomees.neulbomgil_backend.domain.auth.entity.Role;
import com.gooroomees.neulbomgil_backend.domain.auth.entity.Status;
import com.gooroomees.neulbomgil_backend.domain.auth.entity.UserAuth;
import com.gooroomees.neulbomgil_backend.domain.auth.repository.UserAuthRepository;
import com.gooroomees.neulbomgil_backend.domain.board.repository.BoardRepository;
import com.gooroomees.neulbomgil_backend.domain.reply.repository.ReplyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UserAuthRepository userAuthRepository;
    private final BoardRepository boardRepository;
    private final ReplyRepository replyRepository;


    public List<AdminUserResponseDto> getUsers() {
        List<UserAuth> users =
                userAuthRepository.findByRole(Role.USER);

        List<AdminUserResponseDto> adminUserResponseDtoList = new ArrayList<>();
        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("yyyy.MM.dd");
        for (UserAuth user : users) {
            Long boardCount = boardRepository.countByUser(user);
            Long replyCount = replyRepository.countByUser(user);

            adminUserResponseDtoList.add(
                    new AdminUserResponseDto(
                            user.getUserId(),
                            user.getName(),
                            user.getEmail(),
                            boardCount,
                            replyCount,
                            user.getStatus(),
                            user.getCreatedAt().toString()
                    )
            );
        }

        return adminUserResponseDtoList;
    }


    public List<AdminUserResponseDto> getDeletedUsers() {
        List<UserAuth> users = userAuthRepository.findByStatus(Status.REMOVED);

        List<AdminUserResponseDto> adminUserResponseDtoList = new ArrayList<>();
        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("yyyy.MM.dd");
        for (UserAuth user : users) {
            Long boardCount = boardRepository.countByUser(user);
            Long replyCount = replyRepository.countByUser(user);

            adminUserResponseDtoList.add(
                    new AdminUserResponseDto(
                            user.getUserId(),
                            user.getName(),
                            user.getEmail(),
                            boardCount,
                            replyCount,
                            user.getStatus(),
                            user.getCreatedAt().toString()
                    )
            );
        }

        return adminUserResponseDtoList;
    }
    @Transactional
    public void updateUserStatus(Long userId) {
        UserAuth user = userAuthRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        if (user.getStatus().equals(Status.ACTIVE)) {
            user.changeStatus(Status.REMOVED);
        } else {
            user.changeStatus(Status.ACTIVE);
        }
    }


}
