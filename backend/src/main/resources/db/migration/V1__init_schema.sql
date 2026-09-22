CREATE TABLE `user` (
    user_id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role TINYINT,
    status TINYINT,
    created_at DATETIME(6),
    modified_at DATETIME(6),
    CONSTRAINT pk_user PRIMARY KEY (user_id),
    CONSTRAINT uk_user_email UNIQUE (email),
    CONSTRAINT chk_user_role CHECK (role BETWEEN 0 AND 1),
    CONSTRAINT chk_user_status CHECK (status BETWEEN 0 AND 2)
);

CREATE TABLE facility (
    id VARCHAR(255) NOT NULL,
    facility_name VARCHAR(255),
    facility_tel VARCHAR(255),
    category_name VARCHAR(255),
    old_address VARCHAR(255),
    new_address VARCHAR(255),
    longitude DOUBLE,
    latitude DOUBLE,
    facility_score INTEGER,
    facility_image VARCHAR(255),
    capacity_cnt INTEGER,
    current_cnt INTEGER,
    CONSTRAINT pk_facility PRIMARY KEY (id)
);

CREATE TABLE park (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    lot_address VARCHAR(255),
    latitude DOUBLE,
    longitude DOUBLE,
    area DOUBLE,
    CONSTRAINT pk_park PRIMARY KEY (id)
);

CREATE TABLE favorite (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    facility_id VARCHAR(255) NOT NULL,
    CONSTRAINT pk_favorite PRIMARY KEY (id)
);

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

CREATE TABLE board (
    boardid BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT,
    title VARCHAR(255),
    content VARCHAR(255),
    cnt INTEGER NOT NULL DEFAULT 0,
    like_cnt INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME(6),
    modified_at DATETIME(6),
    CONSTRAINT pk_board PRIMARY KEY (boardid)
);

CREATE TABLE board_file (
    fileid BIGINT NOT NULL AUTO_INCREMENT,
    board_id BIGINT,
    origin_name VARCHAR(255),
    saved_name VARCHAR(255),
    file_path VARCHAR(255),
    file_size BIGINT NOT NULL,
    CONSTRAINT pk_board_file PRIMARY KEY (fileid),
    CONSTRAINT fk_board_file_board FOREIGN KEY (board_id)
        REFERENCES board (boardid)
        ON DELETE RESTRICT
);

CREATE TABLE board_like (
    id BIGINT NOT NULL AUTO_INCREMENT,
    board_id BIGINT,
    user_id BIGINT,
    CONSTRAINT pk_board_like PRIMARY KEY (id),
    CONSTRAINT uk_board_like_board_user UNIQUE (board_id, user_id),
    CONSTRAINT fk_board_like_board FOREIGN KEY (board_id)
        REFERENCES board (boardid)
        ON DELETE RESTRICT
);

CREATE TABLE reply (
    reply_id BIGINT NOT NULL AUTO_INCREMENT,
    board_id BIGINT,
    user_id BIGINT,
    content VARCHAR(255),
    created_at DATETIME(6),
    modified_at DATETIME(6),
    CONSTRAINT pk_reply PRIMARY KEY (reply_id),
    CONSTRAINT fk_reply_board FOREIGN KEY (board_id)
        REFERENCES board (boardid)
        ON DELETE RESTRICT
);

CREATE INDEX idx_facility_location ON facility (latitude, longitude);
CREATE INDEX idx_facility_score_id ON facility (facility_score, id);
CREATE INDEX idx_park_location ON park (latitude, longitude);
CREATE INDEX idx_favorite_user_id ON favorite (user_id);
CREATE INDEX idx_favorite_user_facility ON favorite (user_id, facility_id);
CREATE INDEX idx_chat_room_user_id ON chat_room (user_id);
CREATE INDEX idx_chat_room_last_message_at ON chat_room (last_message_at);
CREATE INDEX idx_chat_room_created_at ON chat (room_id, created_at);
CREATE INDEX idx_chat_unread ON chat (room_id, user_id, read_at);
CREATE INDEX idx_board_created_at ON board (created_at);
CREATE INDEX idx_board_cnt ON board (cnt);
CREATE INDEX idx_board_user_id ON board (user_id);
CREATE INDEX idx_board_file_board_id ON board_file (board_id);
CREATE INDEX idx_reply_board_id ON reply (board_id);
CREATE INDEX idx_reply_user_id ON reply (user_id);
