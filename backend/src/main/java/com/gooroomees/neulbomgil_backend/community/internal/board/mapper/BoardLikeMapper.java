package com.gooroomees.neulbomgil_backend.community.internal.board.mapper;

import com.gooroomees.neulbomgil_backend.community.internal.board.entity.BoardLike;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Optional;

@Mapper
public interface BoardLikeMapper {

    int insert(BoardLike boardLike);

    Optional<BoardLike> findByBoardIdAndUserId(
            @Param("boardId") Long boardId,
            @Param("userId") Long userId
    );

    boolean existsByBoardIdAndUserId(
            @Param("boardId") Long boardId,
            @Param("userId") Long userId
    );

    int deleteById(@Param("id") Long id);

    int deleteByBoardId(@Param("boardId") Long boardId);
}
