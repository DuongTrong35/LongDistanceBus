-- V3: Fix password column issue
-- Check if the column exists before dropping it
SET @dbname = DATABASE();
SET @tablename = 'users';
SET @columnname = 'email';
SET @preparedStatement = (SELECT IF(
  EXISTS(
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_schema = @dbname)
      AND (table_name = @tablename)
      AND (column_name = @columnname)
  ),
  CONCAT('ALTER TABLE ', @tablename, ' DROP COLUMN ', @columnname, ';'),
  'SELECT 1'
));

PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;