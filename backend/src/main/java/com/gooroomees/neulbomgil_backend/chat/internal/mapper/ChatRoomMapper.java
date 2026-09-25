package com.gooroomees.neulbomgil_backend.chat.internal.mapper;

import com.gooroomees.neulbomgil_backend.chat.internal.dto.ChatRoomResponseDto;
import com.gooroomees.neulbomgil_backend.chat.internal.entity.ChatRoom;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface ChatRoomMapper {

    int insert(ChatRoom chatRoom);

    Optional<ChatRoom> findByUserId(@Param("userId") Long userId);

    Optional<ChatRoom> findById(@Param("roomId") Long roomId);

    int updateLastMessageAt(ChatRoom chatRoom);

    List<ChatRoomResponseDto> findAllChatRoomResponses();

    Optional<ChatRoomResponseDto> findChatRoomResponse(@Param("roomId") Long roomId);
}
