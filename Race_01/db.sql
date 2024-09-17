DROP DATABASE IF EXISTS ucode_web;
CREATE DATABASE ucode_web;

DROP USER IF EXISTS 'ahieienko'@'localhost';
CREATE USER 'ahieienko'@'localhost' IDENTIFIED BY 'securepass';
GRANT ALL PRIVILEGES ON *.* TO 'ahieienko'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

USE ucode_web;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS cards;
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    login VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    searching BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS game (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    status ENUM('progress', 'lose', 'win') NOT NULL DEFAULT 'progress',
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS cards(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    attack_points INT NOT NULL,
    defense_points INT NOT NULL,
    cost INT NOT NULL,
    PRIMARY KEY (id)
)
