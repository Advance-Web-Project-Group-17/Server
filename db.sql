create table users (
    user_id serial primary key,
    user_name varchar(100) unique not null,
    email varchar(100) unique not null,
    password varchar(255) not null,
    avatar varchar(255),
    nickName varchar(255),
    is_confirmed BOOLEAN DEFAULT FALSE
) 
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

create table notification (
	noti_id serial primary key,
	user_id int not null,
	content varchar(255),
	constraint fk_user foreign key (user_id) references users(user_id)
)