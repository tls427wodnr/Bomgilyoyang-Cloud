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

CREATE INDEX idx_facility_location ON facility (latitude, longitude);
CREATE INDEX idx_facility_score_id ON facility (facility_score, id);
CREATE INDEX idx_park_location ON park (latitude, longitude);
