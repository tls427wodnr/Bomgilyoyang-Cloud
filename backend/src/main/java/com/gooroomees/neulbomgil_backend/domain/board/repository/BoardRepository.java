package com.gooroomees.neulbomgil_backend.domain.board.repository;

import com.gooroomees.neulbomgil_backend.domain.auth.entity.UserAuth;
import com.gooroomees.neulbomgil_backend.domain.board.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BoardRepository extends JpaRepository<Board, Long> {

    // 최신순 — JOIN FETCH로 user 함께 로딩
    @Query(value = "SELECT b FROM Board b JOIN FETCH b.user ORDER BY b.createdAt DESC",
            countQuery = "SELECT COUNT(b) FROM Board b")
    Page<Board> findAllWithUserOrderByCreatedAt(Pageable pageable);

    // 조회수순 — JOIN FETCH로 user 함께 로딩
    @Query(value = "SELECT b FROM Board b JOIN FETCH b.user ORDER BY b.cnt DESC",
            countQuery = "SELECT COUNT(b) FROM Board b")
    Page<Board> findAllWithUserOrderByCnt(Pageable pageable);

    // 댓글 많은순 — JOIN FETCH로 user 함께 로딩
    @Query(value = """
        SELECT b FROM Board b
        JOIN FETCH b.user
        LEFT JOIN Reply r ON r.board = b
        GROUP BY b
        ORDER BY COUNT(r) DESC, b.createdAt DESC
    """, countQuery = "SELECT COUNT(b) FROM Board b")
    Page<Board> findAllOrderByReplyCount(Pageable pageable);

    // 검색 — JOIN FETCH로 user 함께 로딩
    @Query(value = "SELECT b FROM Board b JOIN FETCH b.user WHERE b.title LIKE %:keyword% OR b.content LIKE %:keyword% ORDER BY b.createdAt DESC",
            countQuery = "SELECT COUNT(b) FROM Board b WHERE b.title LIKE %:keyword% OR b.content LIKE %:keyword%")
    Page<Board> findByKeywordWithUser(@Param("keyword") String keyword, Pageable pageable);

    Long countByUser(UserAuth user);

    Page<Board> findByUser(UserAuth user, Pageable pageable);
}
