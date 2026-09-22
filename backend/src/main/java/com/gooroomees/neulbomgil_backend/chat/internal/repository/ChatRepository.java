package com.gooroomees.neulbomgil_backend.chat.internal.repository;

import com.gooroomees.neulbomgil_backend.chat.internal.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    @Query("""
            select c
            from Chat c
            where c.chatRoom.roomId = :roomId
            order by c.createdAt asc
            """)
    List<Chat> FindMessagesByRoomId(@Param("roomId") Long roomId);

    @Modifying
    @Query(
            """
update Chat  c
set c.readAt = CURRENT_TIMESTAMP
where c.chatRoom.roomId = :roomId
and c.senderId != :senderId
and c.readAt is null
"""
    )
    void  updateReadAt(Long roomId, Long senderId);


@Query("""
    select count(c) > 0
    from Chat c
    where c.chatRoom.userId = :userId
    and c.senderId != :userId
    and c.readAt is null
""")
boolean existsUnreadChatByUserId(@Param("userId") Long userId);


}
