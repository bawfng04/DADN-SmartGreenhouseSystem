
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- test data
INSERT INTO users (username, password)
VALUES
  ('testuser', '5f4dcc3b5aa765d61d8327deb882cf99'), -- password: 'password'
  ('admin', '21232f297a57a5a743894a0e4a801fc3'); -- password: 'admin'

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
