

-- USER TABLE
CREATE TABLE USERS(
    ID INT PRIMARY KEY,
    USERNAME VARCHAR(255) NOT NULL,
    PASSWORD VARCHAR(255) NOT NULL
)

CREATE TABLE SCHEDULE_TASKS(
    ID SERIAL PRIMARY KEY,
    USER_ID INT NOT NULL,
    FEED_KEY VARCHAR(255) NOT NULL,
    PAYLOAD VARCHAR(255) NOT NULL,
    EXECUTE_AT TIMESTAMP NOT NULL,
    STATUS VARCHAR(255) NOT NULL DEFAULT 'PENDING',
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
)

CREATE TABLE sensors (
  id SERIAL PRIMARY KEY,
  feed_name VARCHAR(100) NOT NULL,
  value FLOAT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_feed_timestamp_sensors UNIQUE (feed_name, timestamp)
);

CREATE TABLE devices (
  id SERIAL PRIMARY KEY,
  feed_name VARCHAR(100) NOT NULL,
  value FLOAT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_feed_timestamp_devices UNIQUE (feed_name, timestamp)
);

CREATE TABLE threshold (
  feed_name VARCHAR(255) PRIMARY KEY,
  upper_value VARCHAR(255) NOT NULL,
  lower_value VARCHAR(255) NOT NULL
);

--Bảng reminders
CREATE TABLE reminders (
    id SERIAL PRIMARY KEY,
    index_name VARCHAR(50) NOT NULL, -- 'temperature', 'humidity'...
    higher_than_value NUMERIC,
    higher_than_status BOOLEAN DEFAULT FALSE,
    lower_than_value NUMERIC,
    lower_than_status BOOLEAN DEFAULT FALSE,
    repeat_after_value INTEGER,
    repeat_after_status BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO reminders (index_name, higher_than_value, higher_than_status, lower_than_value, lower_than_status, repeat_after_value, repeat_after_status, active) VALUES
('temperature', 40, TRUE, 19, TRUE, 24, TRUE, TRUE),
('humidity', NULL, FALSE, 19, TRUE, NULL, FALSE, FALSE);