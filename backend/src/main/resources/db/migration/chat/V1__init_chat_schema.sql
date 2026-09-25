CREATE TABLE chat_room (
    room_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    last_message_at DATETIME(6),
    CONSTRAINT pk_chat_room PRIMARY KEY (room_id)
);

CREATE TABLE chat (
    chat_id BIGINT NOT NULL AUTO_INCREMENT,
    room_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    message TEXT,
    created_at DATETIME(6) NOT NULL,
    read_at DATETIME(6),
    CONSTRAINT pk_chat PRIMARY KEY (chat_id),
    CONSTRAINT fk_chat_chat_room FOREIGN KEY (room_id)
        REFERENCES chat_room (room_id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_chat_room_user_id ON chat_room (user_id);
CREATE INDEX idx_chat_room_last_message_at ON chat_room (last_message_at);
CREATE INDEX idx_chat_room_created_at ON chat (room_id, created_at);
CREATE INDEX idx_chat_unread ON chat (room_id, user_id, read_at);
