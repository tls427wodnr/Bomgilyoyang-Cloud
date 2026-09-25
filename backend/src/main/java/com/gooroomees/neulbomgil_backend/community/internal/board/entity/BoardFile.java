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
public class BoardFile {

    private Long fileid;

    private Board board;

    private String originName;   // 원본 파일명
    private String savedName;    // 저장된 파일명 (UUID)
    private String filePath;     // 저장 경로 (절대경로)
    private long fileSize;       // 파일 크기 (bytes)

    // 프론트에서 다운로드 URL로 사용
    public String getFileUrl() {
        return "/api/boards/files/" + this.fileid;
    }

    // 원본 파일명 — BoardService.getOriginalFileName() 에서 사용
    public String getOriginalName() {
        return this.originName;
    }

    public static BoardFile create(Board board, String originName, String savedName,
                                   String filePath, long fileSize) {
        BoardFile file = new BoardFile();
        file.board = board;
        file.originName = originName;
        file.savedName = savedName;
        file.filePath = filePath;
        file.fileSize = fileSize;
        return file;
    }
}
