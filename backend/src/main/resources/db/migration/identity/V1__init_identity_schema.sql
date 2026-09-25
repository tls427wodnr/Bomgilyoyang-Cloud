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
