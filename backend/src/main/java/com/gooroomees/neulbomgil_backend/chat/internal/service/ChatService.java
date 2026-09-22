package com.gooroomees.neulbomgil_backend.chat.internal.service;


import com.gooroomees.neulbomgil_backend.identity.UserDirectory;
import com.gooroomees.neulbomgil_backend.identity.UserSummary;
import com.gooroomees.neulbomgil_backend.chat.internal.dto.ChatRequestDto;
import com.gooroomees.neulbomgil_backend.chat.internal.dto.ChatResponseDto;
import com.gooroomees.neulbomgil_backend.chat.internal.dto.ChatRoomResponseDto;
import com.gooroomees.neulbomgil_backend.chat.internal.entity.Chat;
import com.gooroomees.neulbomgil_backend.chat.internal.repository.ChatRoomRepository;
import com.gooroomees.neulbomgil_backend.chat.internal.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.gooroomees.neulbomgil_backend.chat.internal.entity.ChatRoom;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatRepository chatRepository;
    private final UserDirectory userDirectory;

    public ChatRoomResponseDto startChatRoom(Long userId) {


        UserSummary user = findUser(userId);


        ChatRoom chatRoom = chatRoomRepository
                .findChatRoom(userId)
                .orElseGet(() -> chatRoomRepository.save(
                        ChatRoom.builder()
                                .userId(userId)
                                .build()
                ));

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
        List<Chat> chats = chatRepository.FindMessagesByRoomId(roomId);
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


        return chatRoomRepository.findAllChatRoomResponses().stream()
                .map(this::withUserName)
                .toList();
    }

    @Transactional
    public ChatResponseDto saveMessage(Long roomId, Long userId, ChatRequestDto requestDto) {

        ChatRoom room = chatRoomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("채팅방이 없습니다."));;

        findUser(userId);

        Chat chat = Chat.create(
                room,
                userId,
                requestDto.message()
        );

        Chat savedChat = chatRepository.save(chat);

        room.updateLastMessageAt();

        return new ChatResponseDto(
                savedChat.getChatId(),
                roomId,
                userId,
                savedChat.getMessage(),
                savedChat.getCreatedAt(),
                savedChat.getReadAt()
        );
    }
    @Transactional
    public void readMessages(Long roomId,Long senderId) {
        chatRepository.updateReadAt(roomId,senderId);
    }

    public boolean hasUnreadChats(Long userId) {
       return chatRepository.existsUnreadChatByUserId(userId);
    }
    public ChatRoomResponseDto getChatRoom(Long roomId) {

        return chatRoomRepository.findChatRoomResponse(roomId)
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
