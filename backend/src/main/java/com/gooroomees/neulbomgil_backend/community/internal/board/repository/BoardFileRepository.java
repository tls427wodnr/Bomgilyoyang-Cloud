package com.gooroomees.neulbomgil_backend.community.internal.board.repository;

import com.gooroomees.neulbomgil_backend.community.internal.board.entity.Board;
import com.gooroomees.neulbomgil_backend.community.internal.board.entity.BoardFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardFileRepository extends JpaRepository<BoardFile, Long> {
    List<BoardFile> findByBoard(Board board);
    void deleteByBoard(Board board);
}
