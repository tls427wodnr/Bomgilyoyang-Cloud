package com.gooroomees.neulbomgil_backend.chat.internal.service;


import com.gooroomees.neulbomgil_backend.identity.UserDirectory;
import com.gooroomees.neulbomgil_backend.identity.UserSummary;
import com.gooroomees.neulbomgil_backend.chat.internal.dto.ChatRequestDto;
import com.gooroomees.neulbomgil_backend.chat.internal.dto.ChatResponseDto;
import com.gooroomees.neulbomgil_backend.chat.internal.dto.ChatRoomResponseDto;
import com.gooroomees.neulbomgil_backend.chat.internal.entity.Chat;
import com.gooroomees.neulbomgil_backend.chat.internal.mapper.ChatMapper;
import com.gooroomees.neulbomgil_backend.chat.internal.mapper.ChatRoomMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.gooroomees.neulbomgil_backend.chat.internal.entity.ChatRoom;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(transactionManager = "chatTransactionManager", readOnly = true)
public class ChatService {

    private final ChatRoomMapper chatRoomMapper;
    private final ChatMapper chatMapper;
    private final UserDirectory userDirectory;

    @Transactional(transactionManager = "chatTransactionManager")
    public ChatRoomResponseDto startChatRoom(Long userId) {


        UserSummary user = findUser(userId);


        ChatRoom chatRoom = chatRoomMapper
                .findByUserId(userId)
                .orElseGet(() -> {
                    ChatRoom newChatRoom = ChatRoom.builder()
                            .userId(userId)
                            .build();
                    chatRoomMapper.insert(newChatRoom);
                    return newChatRoom;
                });

        return new ChatRoomResponseDto(
                chatRoom.getRoomId(),
                user.userId(),
                user.name(),
                null,
                null,
                false
        );

    }

    public List<ChatResponseDto> getMessageByRoomId(Long roomId,Long userId) {
        List<Chat> chats = chatMapper.findMessagesByRoomId(roomId);
        List<ChatResponseDto> chatResponseDtoList = new ArrayList<>();

        for (Chat chat : chats) {
            chatResponseDtoList.add(
                    new ChatResponseDto(
                            chat.getChatId(),
                            roomId,
                            chat.getSenderId(),
                            chat.getMessage(),
                            chat.getCreatedAt(),
                            chat.getReadAt()
                    )
            );
        }

        return chatResponseDtoList;
    }

    public List<ChatRoomResponseDto> getAllChatRooms() {


        return chatRoomMapper.findAllChatRoomResponses().stream()
                .map(this::withUserName)
                .toList();
    }

    @Transactional(transactionManager = "chatTransactionManager")
    public ChatResponseDto saveMessage(Long roomId, Long userId, ChatRequestDto requestDto) {

        ChatRoom room = chatRoomMapper.findById(roomId)
                .orElseThrow(() -> new RuntimeException("채팅방이 없습니다."));

        findUser(userId);

        Chat chat = Chat.create(
                room,
                userId,
                requestDto.message()
        );

        chatMapper.insert(chat);

        room.updateLastMessageAt();
        chatRoomMapper.updateLastMessageAt(room);

        return new ChatResponseDto(
                chat.getChatId(),
                roomId,
                userId,
                chat.getMessage(),
                chat.getCreatedAt(),
                chat.getReadAt()
        );
    }
    @Transactional(transactionManager = "chatTransactionManager")
    public void readMessages(Long roomId,Long senderId) {
        chatMapper.updateReadAt(roomId,senderId);
    }

    public boolean hasUnreadChats(Long userId) {
       return chatMapper.existsUnreadChatByUserId(userId);
    }
    public ChatRoomResponseDto getChatRoom(Long roomId) {

        return chatRoomMapper.findChatRoomResponse(roomId)
                .map(this::withUserName)
                .orElseThrow(() -> new RuntimeException("채팅방 없음"));
    }

    private UserSummary findUser(Long userId) {
        return userDirectory.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));
    }

    private ChatRoomResponseDto withUserName(ChatRoomResponseDto room) {
        return new ChatRoomResponseDto(
                room.roomId(),
                room.userId(),
                findUser(room.userId()).name(),
                room.lastMessage(),
                room.lastMessageAt(),
                room.unread()
        );
    }
}
