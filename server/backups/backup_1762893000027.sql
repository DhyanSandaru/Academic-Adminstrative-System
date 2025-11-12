/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: admin_accounts
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `admin_accounts` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: lecturer_modules
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `lecturer_modules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lecturer_id` varchar(20) DEFAULT NULL,
  `module_id` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lecturer_id` (`lecturer_id`),
  KEY `module_id` (`module_id`),
  CONSTRAINT `lecturer_modules_ibfk_1` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturers` (`lecturer_id`) ON DELETE CASCADE,
  CONSTRAINT `lecturer_modules_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `modules` (`module_id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: lecturers
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `lecturers` (
  `lecturer_id` varchar(20) NOT NULL,
  `lecturer_name` varchar(100) DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `nic` varchar(20) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `highest_qualification` varchar(100) DEFAULT NULL,
  `institute` varchar(100) DEFAULT NULL,
  `field_of_study` varchar(100) DEFAULT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `certifications` text,
  `joined_year` varchar(10) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`lecturer_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `nic` (`nic`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: modules
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `modules` (
  `module_id` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `payment` decimal(10, 2) DEFAULT NULL,
  `minAge` int DEFAULT NULL,
  `maxAge` int DEFAULT NULL,
  `description` text,
  `courseBanner` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`module_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: payments
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `payments` (
  `ref_no` varchar(20) NOT NULL,
  `student_name` varchar(100) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `course_module` varchar(100) NOT NULL,
  `lecturer` varchar(100) NOT NULL,
  `amount` decimal(10, 2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ref_no`),
  UNIQUE KEY `ref_no` (`ref_no`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: pending_requests
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `pending_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentName` varchar(150) NOT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `ethnicity` varchar(100) DEFAULT NULL,
  `exam` varchar(100) DEFAULT NULL,
  `examYear` year DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `nic` varchar(50) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `address` text,
  `guardianName` varchar(150) DEFAULT NULL,
  `guardianMobile` varchar(20) DEFAULT NULL,
  `guardianRelation` varchar(50) DEFAULT NULL,
  `previousEducation` text,
  `grade` varchar(20) DEFAULT NULL,
  `courseModules` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `profile_photo` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `nic` (`nic`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: registration_codes
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `registration_codes` (
  `code` varchar(10) NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`code`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: student_modules
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `student_modules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(20) NOT NULL,
  `module_id` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `student_modules_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: students
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(20) NOT NULL,
  `student_name` varchar(100) NOT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `gender` enum('Male', 'Female', 'Other') NOT NULL,
  `dob` date DEFAULT NULL,
  `ethnicity` varchar(50) DEFAULT NULL,
  `exam` varchar(20) DEFAULT NULL,
  `exam_year` year NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `nic` varchar(20) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `address` text,
  `guardian_name` varchar(100) DEFAULT NULL,
  `guardian_mobile` varchar(15) DEFAULT NULL,
  `guardian_relation` varchar(50) DEFAULT NULL,
  `previous_education` varchar(150) DEFAULT NULL,
  `grade` varchar(20) DEFAULT NULL,
  `submitted_at` date NOT NULL,
  `payment_status` enum('Pending', 'Paid') NOT NULL,
  `age` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_id` (`student_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 8 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: timetable
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `timetable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `day` varchar(15) NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time NOT NULL,
  `subject` varchar(100) NOT NULL,
  `professor` varchar(100) NOT NULL,
  `grade` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: admin_accounts
# ------------------------------------------------------------

INSERT INTO
  `admin_accounts` (`admin_id`, `username`, `password`, `email`)
VALUES
  (1, 'admin123', '1234', 'admin@example.com');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: lecturer_modules
# ------------------------------------------------------------

INSERT INTO
  `lecturer_modules` (`id`, `lecturer_id`, `module_id`)
VALUES
  (3, 'L2022O_L001', 'M002');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: lecturers
# ------------------------------------------------------------

INSERT INTO
  `lecturers` (
    `lecturer_id`,
    `lecturer_name`,
    `profile_photo`,
    `gender`,
    `email`,
    `nic`,
    `mobile`,
    `address`,
    `highest_qualification`,
    `institute`,
    `field_of_study`,
    `experience`,
    `certifications`,
    `joined_year`,
    `created_at`
  )
VALUES
  (
    'L2022O_L001',
    'Kamal Nuwan',
    '/lecturers/1762055270199-95796832.jpg',
    'female',
    'sunamihora@gmail.com',
    '199867568934',
    '0119119119',
    'Madamulana, Hambanthota',
    'Bsc in Computer Science',
    '',
    '',
    '',
    '',
    '2022 O/L',
    '2025-10-31 17:01:19'
  );
INSERT INTO
  `lecturers` (
    `lecturer_id`,
    `lecturer_name`,
    `profile_photo`,
    `gender`,
    `email`,
    `nic`,
    `mobile`,
    `address`,
    `highest_qualification`,
    `institute`,
    `field_of_study`,
    `experience`,
    `certifications`,
    `joined_year`,
    `created_at`
  )
VALUES
  (
    'L2026001',
    'Dhyan Sandaru',
    '/lecturers/1758078618130-321626778.jpg',
    'male',
    'Dhyan@gmail.com',
    '20031254875',
    '0789966554',
    'Colombo',
    '',
    '',
    '',
    '',
    '',
    '2026',
    '2025-10-31 17:01:19'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: modules
# ------------------------------------------------------------

INSERT INTO
  `modules` (
    `module_id`,
    `name`,
    `payment`,
    `minAge`,
    `maxAge`,
    `description`,
    `courseBanner`
  )
VALUES
  ('M001', 'Chemistry', NULL, NULL, NULL, NULL, NULL);
INSERT INTO
  `modules` (
    `module_id`,
    `name`,
    `payment`,
    `minAge`,
    `maxAge`,
    `description`,
    `courseBanner`
  )
VALUES
  ('M002', 'Physics', NULL, NULL, NULL, NULL, NULL);
INSERT INTO
  `modules` (
    `module_id`,
    `name`,
    `payment`,
    `minAge`,
    `maxAge`,
    `description`,
    `courseBanner`
  )
VALUES
  ('M003', 'Maths', NULL, NULL, NULL, NULL, NULL);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: payments
# ------------------------------------------------------------

INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`
  )
VALUES
  (
    '20250930-AOEEVF',
    'Dhyan Sandaru',
    'S2022A_L001',
    'Chemistry',
    'Ishara Sanjula',
    4000.00,
    '2025-09-30 15:55:21'
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`
  )
VALUES
  (
    '20250930-PF1JUX',
    'Dhyan Sandaru',
    'S2022A_L001',
    'Chemistry',
    'Ishara Sanjula',
    1000.00,
    '2025-09-30 15:47:28'
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`
  )
VALUES
  (
    '20250930-TDQ7P5',
    'Dhyan Sandaru',
    'S2022A_L001',
    'Chemistry',
    'Ishara Sanjula',
    400.00,
    '2025-09-30 15:32:45'
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`
  )
VALUES
  (
    '20251002-SU5TG9',
    'V.P. Akila Jayasinghe',
    'S2022A_L002',
    'Chemistry',
    'Ishara Sanjula',
    4000.00,
    '2025-10-02 08:27:33'
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`
  )
VALUES
  (
    '20251007-Q7FJ34',
    'Yogarajah Gowreesan',
    'S2022A_L003',
    'Chemistry',
    'Ishara Sanjula',
    5000.00,
    '2025-10-07 09:15:10'
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`
  )
VALUES
  (
    '20251014-LP9J8U',
    'Dhyan Sandaru',
    'S2022A_L001',
    'Chemistry',
    'Ishara Sanjula',
    10000.00,
    '2025-10-14 16:01:19'
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`
  )
VALUES
  (
    '20251022-3BKUYU',
    'Dhyan Sandaru',
    'S-2022-001',
    'Physics',
    'Kamal Nuwan',
    5000.00,
    '2025-10-22 12:27:54'
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`
  )
VALUES
  (
    'PAY-20250922-GPVQF9',
    'Dhyan Sandaru',
    'S2022A_L001',
    'Maths',
    'Kamal Nuwan',
    6000.00,
    '2025-09-22 23:54:24'
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`
  )
VALUES
  (
    'PAY-20250923-O0I71H',
    'Saman Kumara',
    'S2023A_L001',
    'Maths',
    'Ishara Sanjula',
    6000.00,
    '2025-09-23 11:11:31'
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`
  )
VALUES
  (
    'PAY-20250924-Q7MO3N',
    'Albert Hans',
    'S2024A_L001',
    'Physics',
    'Ishara Sanjula',
    5000.00,
    '2025-09-24 09:07:42'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: pending_requests
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: registration_codes
# ------------------------------------------------------------

INSERT INTO
  `registration_codes` (`code`, `used`, `created_at`, `expires_at`)
VALUES
  (
    '5kWfI',
    0,
    '2025-10-14 15:19:44',
    '2025-10-14 15:34:45'
  );
INSERT INTO
  `registration_codes` (`code`, `used`, `created_at`, `expires_at`)
VALUES
  (
    '6JgR0',
    1,
    '2025-10-11 11:54:14',
    '2025-10-11 12:09:15'
  );
INSERT INTO
  `registration_codes` (`code`, `used`, `created_at`, `expires_at`)
VALUES
  (
    'EMEFG',
    1,
    '2025-10-22 12:26:08',
    '2025-10-22 12:41:09'
  );
INSERT INTO
  `registration_codes` (`code`, `used`, `created_at`, `expires_at`)
VALUES
  (
    'HJ38B',
    0,
    '2025-10-22 12:20:48',
    '2025-10-22 12:35:49'
  );
INSERT INTO
  `registration_codes` (`code`, `used`, `created_at`, `expires_at`)
VALUES
  (
    'I9oEz',
    1,
    '2025-10-07 10:31:42',
    '2025-10-07 10:46:43'
  );
INSERT INTO
  `registration_codes` (`code`, `used`, `created_at`, `expires_at`)
VALUES
  (
    'K4L9e',
    1,
    '2025-10-07 09:14:26',
    '2025-10-07 09:29:26'
  );
INSERT INTO
  `registration_codes` (`code`, `used`, `created_at`, `expires_at`)
VALUES
  (
    'KHk09',
    1,
    '2025-10-07 05:29:12',
    '2025-10-07 05:44:13'
  );
INSERT INTO
  `registration_codes` (`code`, `used`, `created_at`, `expires_at`)
VALUES
  (
    'sG9f0',
    1,
    '2025-10-16 14:39:12',
    '2025-10-16 14:54:13'
  );
INSERT INTO
  `registration_codes` (`code`, `used`, `created_at`, `expires_at`)
VALUES
  (
    'zh69Z',
    1,
    '2025-10-06 21:31:13',
    '2025-10-06 21:46:14'
  );
INSERT INTO
  `registration_codes` (`code`, `used`, `created_at`, `expires_at`)
VALUES
  (
    'zMk4q',
    1,
    '2025-10-07 09:06:51',
    '2025-10-07 09:21:51'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: student_modules
# ------------------------------------------------------------

INSERT INTO
  `student_modules` (`id`, `student_id`, `module_id`)
VALUES
  (1, 'S-2022-001', 'M002');
INSERT INTO
  `student_modules` (`id`, `student_id`, `module_id`)
VALUES
  (2, 'S-2022-001', 'M001');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: students
# ------------------------------------------------------------

INSERT INTO
  `students` (
    `id`,
    `student_id`,
    `student_name`,
    `profile_photo`,
    `gender`,
    `dob`,
    `ethnicity`,
    `exam`,
    `exam_year`,
    `email`,
    `nic`,
    `mobile`,
    `address`,
    `guardian_name`,
    `guardian_mobile`,
    `guardian_relation`,
    `previous_education`,
    `grade`,
    `submitted_at`,
    `payment_status`,
    `age`
  )
VALUES
  (
    6,
    'S-2022-001',
    'Dhyan Sandaru',
    '/students/1760982172773-116110604.jpg',
    'Male',
    '2003-10-23',
    'Sinhala',
    'A/L',
    '2022',
    'dhyansithru@gmail.com',
    '200329812865',
    '0779418450',
    'Thunthota, Dummalasuriya',
    'W.A.J.S.Herath',
    '0776439372',
    'Father',
    'KDU',
    'Undergraduate',
    '2025-10-20',
    'Pending',
    22
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: timetable
# ------------------------------------------------------------

INSERT INTO
  `timetable` (
    `id`,
    `date`,
    `day`,
    `start_time`,
    `end_time`,
    `subject`,
    `professor`,
    `grade`
  )
VALUES
  (
    6,
    '2025-10-20',
    'Sunday',
    '11:00:00',
    '13:00:00',
    'Maths',
    'Nuwan Pradeep',
    '10'
  );
INSERT INTO
  `timetable` (
    `id`,
    `date`,
    `day`,
    `start_time`,
    `end_time`,
    `subject`,
    `professor`,
    `grade`
  )
VALUES
  (
    7,
    '2025-10-19',
    'Sunday',
    '09:00:00',
    '11:00:00',
    'Physics',
    'Sandeesh Fernando',
    '11'
  );
INSERT INTO
  `timetable` (
    `id`,
    `date`,
    `day`,
    `start_time`,
    `end_time`,
    `subject`,
    `professor`,
    `grade`
  )
VALUES
  (
    8,
    '2025-10-21',
    'Monday',
    '11:00:00',
    '14:00:00',
    'Computer Science',
    'J.K.Perera',
    '10'
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
