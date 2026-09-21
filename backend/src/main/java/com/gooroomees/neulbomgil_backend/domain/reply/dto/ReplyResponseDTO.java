package com.gooroomees.neulbomgil_backend.domain.reply.dto;

import com.gooroomees.neulbomgil_backend.domain.auth.entity.UserAuth;
import com.gooroomees.neulbomgil_backend.domain.reply.entity.Reply;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ReplyResponseDTO {
    private Long replyId;
    private Long boardId;
    private Long userId;
    private String name;
    private String content;
    private LocalDateTime createdAt;
    private boolean isOwner;  // ← 추가: 본인 댓글 여부

    public ReplyResponseDTO(Reply reply, UserAuth currentUser){
        this.replyId = reply.getReplyId();
        this.boardId = reply.getBoard().getBoardid();
        this.userId = reply.getUser().getUserId();
        this.name = reply.getUser().getName();
        this.content = reply.getContent();
        this.createdAt = reply.getCreatedAt();
        this.isOwner = (currentUser != null) && reply.getUser().getUserId().equals(currentUser.getUserId());
    }
}
