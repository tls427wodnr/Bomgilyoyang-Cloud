package com.gooroomees.neulbomgil_backend.community.internal.service;

import com.gooroomees.neulbomgil_backend.community.CommunityActivityCount;
import com.gooroomees.neulbomgil_backend.community.CommunityStatistics;
import com.gooroomees.neulbomgil_backend.community.internal.board.mapper.BoardMapper;
import com.gooroomees.neulbomgil_backend.community.internal.reply.mapper.ReplyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(transactionManager = "communityTransactionManager", readOnly = true)
class CommunityStatisticsService implements CommunityStatistics {

    private final BoardMapper boardMapper;
    private final ReplyMapper replyMapper;

    @Override
    public CommunityActivityCount countByUserId(Long userId) {
        return new CommunityActivityCount(
                boardMapper.countByUserId(userId),
                replyMapper.countByUserId(userId)
        );
    }
}
