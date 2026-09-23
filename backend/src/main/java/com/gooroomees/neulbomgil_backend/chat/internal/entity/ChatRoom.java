package com.gooroomees.neulbomgil_backend.chat.internal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoom {

    private Long roomId;

    private Long userId;

    private LocalDateTime lastMessageAt;

    public void updateLastMessageAt() {
        this.lastMessageAt = LocalDateTime.now();
    }

}
