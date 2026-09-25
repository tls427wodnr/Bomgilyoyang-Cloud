package com.gooroomees.neulbomgil_backend.chat.internal.entity;

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
public class Chat {

    private Long chatId;

    private ChatRoom chatRoom;

    private Long senderId;

    private String message;

    private LocalDateTime createdAt;

    private LocalDateTime readAt;

    public static Chat create(ChatRoom chatRoom,
                              Long senderId,
                              String message) {

        Chat chat = new Chat();
        chat.chatRoom = chatRoom;
        chat.senderId = senderId;
        chat.message = message;
        chat.createdAt = LocalDateTime.now();

        return chat;
    }

    public void readMessage() {
        this.readAt = LocalDateTime.now();
    }
}
