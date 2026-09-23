package com.gooroomees.neulbomgil_backend.community.internal.reply.entity;

import com.gooroomees.neulbomgil_backend.community.internal.board.entity.Board;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reply {

    private Long replyId;

    private Board board;

    private Long userId;

    private String content;

    private LocalDateTime createdAt;

    private LocalDateTime modifiedAt;

    public static Reply create(Board board, Long userId, String content) {
        Reply reply = new Reply();
        reply.board = board;
        reply.userId = userId;
        reply.content = content;
        return reply;
    }
    public void update(String content) {
        this.content = content;
    }
    public void validateOwner(Long userId) {
        if (!this.userId.equals(userId)) {
            throw new IllegalArgumentException("본인 댓글만 수정/삭제할 수 있습니다.");
        }
    }
}
