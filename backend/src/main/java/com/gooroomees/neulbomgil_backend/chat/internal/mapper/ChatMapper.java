package com.gooroomees.neulbomgil_backend.chat.internal.mapper;

import com.gooroomees.neulbomgil_backend.chat.internal.entity.Chat;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ChatMapper {

    int insert(Chat chat);

    List<Chat> findMessagesByRoomId(@Param("roomId") Long roomId);

    int updateReadAt(
            @Param("roomId") Long roomId,
            @Param("senderId") Long senderId
    );

    boolean existsUnreadChatByUserId(@Param("userId") Long userId);
}
