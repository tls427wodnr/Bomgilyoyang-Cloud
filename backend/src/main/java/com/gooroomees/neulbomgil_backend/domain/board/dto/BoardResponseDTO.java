package com.gooroomees.neulbomgil_backend.domain.board.dto;

import com.gooroomees.neulbomgil_backend.domain.board.entity.Board;
import com.gooroomees.neulbomgil_backend.domain.board.entity.BoardFile;
import com.gooroomees.neulbomgil_backend.domain.auth.entity.UserAuth;
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
    public BoardResponseDTO(Board board, long replyCount) {
        this.boardid    = board.getBoardid();
        this.userid     = board.getUser().getUserId();
        this.name       = board.getUser().getName();
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
    public BoardResponseDTO(Board board, long replyCount, boolean likedByMe,
                            List<BoardFile> files, UserAuth currentUser) {
        this.boardid    = board.getBoardid();
        this.userid     = board.getUser().getUserId();
        this.name       = board.getUser().getName();
        this.title      = board.getTitle();
        this.content    = board.getContent();
        this.cnt        = board.getCnt();
        this.likeCnt    = board.getLikeCnt();
        this.replyCount = replyCount;
        this.likedByMe  = likedByMe;
        this.isOwner    = (currentUser != null)
                && board.getUser().getUserId().equals(currentUser.getUserId()); // ← 작성자 본인 여부
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