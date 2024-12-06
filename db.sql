-- Active: 1733396626466@@group-17-movieapp.postgres.database.azure.com@5432@movieapp
create table users (
    user_id serial primary key,
    user_name varchar(100) unique not null,
    email varchar(100) unique not null,
    password varchar(255) not null,
    avatar varchar(255),
    nick_name varchar(255),
    is_confirmed BOOLEAN DEFAULT FALSE,
    location varchar(50),
    is_shared BOOLEAN DEFAULT FALSE
);

CREATE TABLE groups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE group_membership (
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES groups(group_id),
    PRIMARY KEY (group_id, user_id)
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    tmdb_id INT NOT NULL,
    review_text TEXT NOT NULL,                        
    rating INT CHECK (rating >= 1 AND rating <= 5),
    reviewer_email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

create table group_movie (
	group_id int not null,
	user_id int not null,
	movie_id int unique not null,
	CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id),
	CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES groups(group_id),
	PRIMARY KEY (group_id, user_id)
)

CREATE TABLE favorites (
    favorite_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('movie', 'tv')), -- To distinguish between movies and TV shows
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);
