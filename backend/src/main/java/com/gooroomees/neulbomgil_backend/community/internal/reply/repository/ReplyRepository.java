package com.gooroomees.neulbomgil_backend.community.internal.reply.repository;

import com.gooroomees.neulbomgil_backend.community.internal.board.entity.Board;
import com.gooroomees.neulbomgil_backend.community.internal.reply.entity.Reply;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReplyRepository extends JpaRepository<Reply, Long> {
    Page<Reply> findByBoard_Boardid(Long boardId, Pageable pageable);
    long countByBoard(Board board);
    Long countByUserId(Long userId);
    void deleteByBoard(Board board);  // 게시글 삭제 시 댓글 일괄 삭제용
}
