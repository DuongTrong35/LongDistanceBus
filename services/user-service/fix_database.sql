-- Script to fix database schema for user-service
-- Run this in MySQL if you get "Field 'password' doesn't have a default value" error

USE userdb;

-- Check if password column exists
-- If it does, we need to migrate data and drop it

-- Step 1: Add password_hash if it doesn't exist (should already exist from V1)
-- This will fail if column exists, that's OK
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) AFTER email;

-- Step 2: Copy data from password to password_hash if password exists
UPDATE users SET password_hash = password WHERE password_hash IS NULL OR password_hash = '';

-- Step 3: Make password_hash NOT NULL
ALTER TABLE users MODIFY password_hash VARCHAR(255) NOT NULL;

-- Step 4: Drop old password column
ALTER TABLE users DROP COLUMN password;

-- Verify
DESCRIBE users;


