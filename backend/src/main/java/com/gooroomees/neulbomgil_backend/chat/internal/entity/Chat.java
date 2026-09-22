package com.gooroomees.neulbomgil_backend.chat.internal.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_id")
    private Long chatId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private ChatRoom chatRoom;

    @Column(name = "user_id", nullable = false)
    private Long senderId;


    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "read_at")
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
