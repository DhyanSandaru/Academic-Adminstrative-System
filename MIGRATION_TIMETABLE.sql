-- Migration Script: Update timetable table to use module_id instead of subject/professor/grade
-- This script updates the table structure to link timetable entries to courses via module_id

-- Step 1: Add the module_id column (if it doesn't exist)
ALTER TABLE `timetable` 
ADD COLUMN `module_id` VARCHAR(20) AFTER `end_time`;

-- Step 2: Add foreign key constraint to modules table
ALTER TABLE `timetable`
ADD CONSTRAINT `fk_timetable_module_id` 
FOREIGN KEY (`module_id`) REFERENCES `modules` (`module_id`) ON DELETE CASCADE;

-- Step 3: Drop the old columns (subject, professor, grade)
-- WARNING: Make sure you have backed up your data before running this!
ALTER TABLE `timetable` 
DROP COLUMN `subject`,
DROP COLUMN `professor`,
DROP COLUMN `grade`;

-- Verify the new table structure
DESCRIBE `timetable`;

-- Expected output:
-- | Field     | Type        | Null | Key | Default | Extra          |
-- | id        | int         | NO   | PRI | NULL    | auto_increment |
-- | date      | date        | YES  |     | NULL    |                |
-- | day       | varchar(20) | YES  |     | NULL    |                |
-- | start_time| time        | YES  |     | NULL    |                |
-- | end_time  | time        | YES  |     | NULL    |                |
-- | module_id | varchar(20) | YES  | MUL | NULL    |                |
