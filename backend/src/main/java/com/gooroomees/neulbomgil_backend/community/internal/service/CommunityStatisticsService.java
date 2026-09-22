package com.gooroomees.neulbomgil_backend.community.internal.service;

import com.gooroomees.neulbomgil_backend.community.CommunityActivityCount;
import com.gooroomees.neulbomgil_backend.community.CommunityStatistics;
import com.gooroomees.neulbomgil_backend.community.internal.board.repository.BoardRepository;
import com.gooroomees.neulbomgil_backend.community.internal.reply.repository.ReplyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
class CommunityStatisticsService implements CommunityStatistics {

    private final BoardRepository boardRepository;
    private final ReplyRepository replyRepository;

    @Override
    public CommunityActivityCount countByUserId(Long userId) {
        return new CommunityActivityCount(
                boardRepository.countByUserId(userId),
                replyRepository.countByUserId(userId)
        );
    }
}
