package com.gooroomees.neulbomgil_backend.community.internal.board.mapper;

import com.gooroomees.neulbomgil_backend.community.internal.board.entity.BoardFile;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface BoardFileMapper {

    int insert(BoardFile boardFile);

    Optional<BoardFile> findById(@Param("fileId") Long fileId);

    List<BoardFile> findByBoardId(@Param("boardId") Long boardId);

    int deleteById(@Param("fileId") Long fileId);

    int deleteByBoardId(@Param("boardId") Long boardId);
}
