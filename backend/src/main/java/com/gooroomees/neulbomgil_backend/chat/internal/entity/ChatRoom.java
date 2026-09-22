package com.gooroomees.neulbomgil_backend.chat.internal.entity;

import jakarta.persistence.*;
import lombok.*;



import java.time.LocalDateTime;

@Entity
@Table(name = "chat_room")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Long roomId;



    @Column(name = "user_id", nullable = false)
    private Long userId;


    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

    public void updateLastMessageAt() {
        this.lastMessageAt = LocalDateTime.now();
    }

}
