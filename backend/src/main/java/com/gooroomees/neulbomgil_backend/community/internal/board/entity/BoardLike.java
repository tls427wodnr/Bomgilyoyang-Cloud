package com.gooroomees.neulbomgil_backend.community.internal.board.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardLike {

    private Long id;

    private Board board;

    private Long userId;

    public static BoardLike create(Board board, Long userId) {
        BoardLike like = new BoardLike();
        like.board = board;
        like.userId = userId;
        return like;
    }
}
