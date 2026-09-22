package com.gooroomees.neulbomgil_backend.community.internal.board.dto;

import com.gooroomees.neulbomgil_backend.community.internal.board.entity.Board;
import com.gooroomees.neulbomgil_backend.community.internal.board.entity.BoardFile;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class BoardResponseDTO {
    private Long boardid;
    private Long userid;
    private String title;
    private String name;
    private String content;
    private int cnt;
    private int likeCnt;
    private long replyCount;
    private boolean likedByMe;
    private boolean isOwner;        // ← 추가: 수정/삭제 버튼 표시용
    private LocalDateTime createdAt;
    private List<FileInfo> files;

    // 목록 조회용
    public BoardResponseDTO(Board board, String userName, long replyCount) {
        this.boardid    = board.getBoardid();
        this.userid     = board.getUserId();
        this.name       = userName;
        this.title      = board.getTitle();
        this.content    = board.getContent();
        this.cnt        = board.getCnt();
        this.likeCnt    = board.getLikeCnt();
        this.replyCount = replyCount;
        this.likedByMe  = false;
        this.isOwner    = false;
        this.createdAt  = board.getCreatedAt();
        this.files      = List.of();
    }

    // 상세 조회용 (likedByMe + files + isOwner 포함)
    public BoardResponseDTO(Board board, String userName, long replyCount, boolean likedByMe,
                            List<BoardFile> files, Long currentUserId) {
        this.boardid    = board.getBoardid();
        this.userid     = board.getUserId();
        this.name       = userName;
        this.title      = board.getTitle();
        this.content    = board.getContent();
        this.cnt        = board.getCnt();
        this.likeCnt    = board.getLikeCnt();
        this.replyCount = replyCount;
        this.likedByMe  = likedByMe;
        this.isOwner    = (currentUserId != null)
                && board.getUserId().equals(currentUserId);
        this.createdAt  = board.getCreatedAt();
        this.files      = files.stream().map(FileInfo::new).toList();
    }

    // 파일 정보 내부 클래스
    @Getter
    public static class FileInfo {
        private Long fileid;
        private String originalName;
        private String fileUrl;
        private long fileSize;

        public FileInfo(BoardFile file) {
            this.fileid       = file.getFileid();
            this.originalName = file.getOriginName();
            this.fileUrl      = "/api/boards/files/" + file.getFileid();
            this.fileSize     = file.getFileSize();
        }
    }
}
