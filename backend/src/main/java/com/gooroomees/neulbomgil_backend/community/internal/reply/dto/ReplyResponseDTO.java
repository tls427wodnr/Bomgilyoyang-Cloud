package com.gooroomees.neulbomgil_backend.community.internal.reply.dto;

import com.gooroomees.neulbomgil_backend.community.internal.reply.entity.Reply;
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

    public ReplyResponseDTO(Reply reply, String userName, Long currentUserId){
        this.replyId = reply.getReplyId();
        this.boardId = reply.getBoard().getBoardid();
        this.userId = reply.getUserId();
        this.name = userName;
        this.content = reply.getContent();
        this.createdAt = reply.getCreatedAt();
        this.isOwner = (currentUserId != null) && reply.getUserId().equals(currentUserId);
    }
}
