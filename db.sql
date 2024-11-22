CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  user_name VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  nickName VARCHAR(255),
  is_confirmed BOOLEAN DEFAULT FALSE
);

CREATE TABLE groups (
  group_id SERIAL PRIMARY KEY,
  group_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE group_membership (
  user_id INT NOT NULL,
  group_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES groups(group_id),
  PRIMARY KEY (group_id, user_id)
);

CREATE TABLE notification (
  noti_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  content VARCHAR(255),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Modify the reviews table to add an `is_anonymous` column
CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  user_id INT,  -- Make user_id nullable
  movie_id INT,  -- Optional field, no foreign key constraint
  review_text TEXT,
  review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_anonymous BOOLEAN DEFAULT FALSE,  -- New column to mark as anonymous
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Modify the ratings table to add an `is_anonymous` column
CREATE TABLE ratings (
  rating_id SERIAL PRIMARY KEY,
  user_id INT,  -- Make user_id nullable
  movie_id INT,  -- Optional field, no foreign key constraint
  rating INT CHECK (rating >= 1 AND rating <= 10),
  rating_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_anonymous BOOLEAN DEFAULT FALSE,  -- New column to mark as anonymous
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);
