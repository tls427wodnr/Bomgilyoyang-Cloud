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

CREATE INDEX idx_board_created_at ON board (created_at);
CREATE INDEX idx_board_cnt ON board (cnt);
CREATE INDEX idx_board_user_id ON board (user_id);
CREATE INDEX idx_board_file_board_id ON board_file (board_id);
CREATE INDEX idx_reply_board_id ON reply (board_id);
CREATE INDEX idx_reply_user_id ON reply (user_id);
