CREATE TABLE favorite (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    facility_id VARCHAR(255) NOT NULL,
    CONSTRAINT pk_favorite PRIMARY KEY (id)
);

CREATE INDEX idx_favorite_user_id ON favorite (user_id);
CREATE INDEX idx_favorite_user_facility ON favorite (user_id, facility_id);
