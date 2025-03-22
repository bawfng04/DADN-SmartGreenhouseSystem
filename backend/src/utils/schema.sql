
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
  lower_value VARCHAR(255) NOT NULL,
);
