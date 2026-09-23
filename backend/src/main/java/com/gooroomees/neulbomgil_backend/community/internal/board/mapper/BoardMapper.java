package com.gooroomees.neulbomgil_backend.community.internal.board.mapper;

import com.gooroomees.neulbomgil_backend.community.internal.board.entity.Board;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface BoardMapper {

    int insert(Board board);

    Optional<Board> findById(@Param("boardId") Long boardId);

    List<Board> findAllOrderByCreatedAt(
            @Param("offset") long offset,
            @Param("size") int size
    );

    List<Board> findAllOrderByViewCount(
            @Param("offset") long offset,
            @Param("size") int size
    );

    List<Board> findAllOrderByReplyCount(
            @Param("offset") long offset,
            @Param("size") int size
    );

    List<Board> findByKeyword(
            @Param("keyword") String keyword,
            @Param("offset") long offset,
            @Param("size") int size
    );

    List<Board> findByUserId(
            @Param("userId") Long userId,
            @Param("offset") long offset,
            @Param("size") int size
    );

    long countAll();

    long countByKeyword(@Param("keyword") String keyword);

    long countByUserId(@Param("userId") Long userId);

    int update(Board board);

    int incrementViewCount(@Param("boardId") Long boardId);

    int updateLikeCount(
            @Param("boardId") Long boardId,
            @Param("likeCount") int likeCount
    );

    int deleteById(@Param("boardId") Long boardId);
}
