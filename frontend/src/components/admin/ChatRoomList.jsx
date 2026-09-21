import rumiFace from '../../assets/images/characters/rumi-face.png';

function ChatRoomList({ chatRooms, onOpenChatRoom }) {
    return (
        <section className="sidebar">
            <div className="sidebar-list">
                {chatRooms.length === 0 && (
                    <div className="chat-empty">
                        채팅방이 없습니다.
                    </div>
                )}

                {chatRooms.map((room) => (
                    <button
                        key={room.roomId}
                        type="button"
                        className="chat-room-button"
                        data-room-id={room.roomId}
                        data-room-name={room.name}
                        onClick={() => onOpenChatRoom(room)}
                    >
                        <img
                            src={rumiFace}
                            className="profile-image"
                            alt="프로필"
                        />

                        <div className="room-content">
                            <div className="room-header">
                                <div className="room-name">
                                    {room.name || '사용자'}
                                </div>

                                <div className="room-time">
                                    {room.lastMessageAt
                                        ? room.lastMessageAt.substring(11, 16)
                                        : ''}
                                </div>
                            </div>

                            <div className="room-last-message">
                                {room.lastMessage || '새로운 문의가 있습니다.'}
                            </div>
                        </div>

                        {room.unread && (
                            <div className="unread-dot"></div>
                        )}
                    </button>
                ))}
            </div>
        </section>
    );
}

export default ChatRoomList;