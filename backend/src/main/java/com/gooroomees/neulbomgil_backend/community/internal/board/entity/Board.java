package com.gooroomees.neulbomgil_backend.community.internal.board.entity;

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
public class Board {

    private Long boardid;

    private Long userId;

    private String title;
    private String content;
    private int cnt;       // 조회수
    private int likeCnt;   // 좋아요 수 (추가)

    private LocalDateTime createdAt;

    private LocalDateTime modifiedAt;

    public static Board create(Long userId, String title, String content) {
        Board board = new Board();
        board.userId = userId;
        board.title = title;
        board.content = content;
        board.cnt = 0;
        board.likeCnt = 0; // 초기값 0
        return board;
    }
    public void increaseCnt() {
        this.cnt += 1;
    }

    public void update(String title, String content) {
        this.title = title;
        this.content = content;
    }
    // 좋아요 증가
    public void increaseLikeCnt() {
        this.likeCnt += 1;
    }

    // 좋아요 감소 (취소 시, 0 아래로 내려가지 않도록 방어)
    public void decreaseLikeCnt() {
        if (this.likeCnt > 0) {
            this.likeCnt -= 1;
        }
    }
    //서비스에서 검사할 걸 여기서 작성하면, 서비스에 여러곳에서 작성할 필요 없이
    //편리함.
    public void validateOwner(Long userId) {
        if (!this.userId.equals(userId)) {
            throw new IllegalArgumentException("본인 글만 수정/삭제할 수 있습니다.");
        }
    }
}
