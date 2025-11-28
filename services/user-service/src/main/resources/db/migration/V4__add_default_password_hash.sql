-- V4: Add default value for password_hash column
ALTER TABLE users 
MODIFY COLUMN password_hash VARCHAR(255) NOT NULL DEFAULT '';
