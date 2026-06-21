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
  `name` varchar(255) DEFAULT NULL,
  `nic` varchar(20) DEFAULT NULL,
  `gender` enum('male', 'female', 'other', '') DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `profile_photo` varchar(255) DEFAULT NULL,
  `status` enum('Active', 'Inactive') DEFAULT 'Active',
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB AUTO_INCREMENT = 16 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  `curriculum` varchar(20) DEFAULT NULL,
  `description` text,
  `courseBanner` varchar(255) DEFAULT NULL,
  `grade` varchar(50) DEFAULT NULL,
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
  `lecturer_id` varchar(50) DEFAULT NULL,
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
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB AUTO_INCREMENT = 14 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB AUTO_INCREMENT = 17 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: timetable
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `timetable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `day` varchar(15) NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time NOT NULL,
  `module_id` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 14 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: admin_accounts
# ------------------------------------------------------------

INSERT INTO
  `admin_accounts` (
    `admin_id`,
    `username`,
    `password`,
    `email`,
    `name`,
    `nic`,
    `gender`,
    `phone`,
    `address`,
    `profile_photo`,
    `status`,
    `last_login`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    1,
    'admin123',
    '$2b$10$8.9TD3/4FycLmjXwBEAuXuR19xN0NMaJgJLaO6RJE2KqYto59s4SK',
    'admin@example.com',
    'Admin',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'Active',
    '2026-06-16 22:51:36',
    '2025-11-14 04:50:22',
    '2026-06-16 22:51:36'
  );
INSERT INTO
  `admin_accounts` (
    `admin_id`,
    `username`,
    `password`,
    `email`,
    `name`,
    `nic`,
    `gender`,
    `phone`,
    `address`,
    `profile_photo`,
    `status`,
    `last_login`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    3,
    'blackassasins0@gmail.com',
    '$2b$10$Vcdf8p/MRf67k/Poud1eF..6DE3b1oZx1mjwO0UzG79mlxvm/T4qu',
    'blackassasins0@gmail.com',
    'Dhyan Sandaru',
    '200329812865',
    'male',
    '0769280577',
    'Thunthota, Dummalasuriya',
    '1773568679783-614671969.jpeg',
    'Active',
    '2026-03-17 22:57:12',
    '2026-03-15 15:27:59',
    '2026-03-17 22:57:12'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: lecturer_modules
# ------------------------------------------------------------

INSERT INTO
  `lecturer_modules` (`id`, `lecturer_id`, `module_id`)
VALUES
  (6, 'L-2025-002', 'M001');
INSERT INTO
  `lecturer_modules` (`id`, `lecturer_id`, `module_id`)
VALUES
  (7, 'L-2025-001', 'M003');
INSERT INTO
  `lecturer_modules` (`id`, `lecturer_id`, `module_id`)
VALUES
  (12, NULL, 'M002');
INSERT INTO
  `lecturer_modules` (`id`, `lecturer_id`, `module_id`)
VALUES
  (15, 'L-2025-001', 'C627');

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
    'L-2025-001',
    'M.A. Chandrapala Perera',
    '/lecturers/1766044464378-278781706.png',
    'Male',
    'chandrapala@gmail.com',
    '20015678934',
    '0768027450',
    'No:2, Colombo Road, Kurunegala',
    'Bsc hons. in physical science',
    'University of Moratuwa',
    'Physical Science',
    '2',
    '',
    '2025',
    '2025-12-18 13:24:25'
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
    'L-2025-002',
    'Heshan Premachandra',
    '',
    'male',
    'heshanpremachandra@gmail.com',
    '198345672840',
    '0768947561',
    'No. 12/3, Galle Road, Bambalapitiya, Colombo 04',
    '',
    '',
    '',
    '',
    '',
    '2025',
    '2025-11-14 06:57:34'
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
    'L-2025-003',
    'Ishan Randika',
    '/lecturers/1763095644245-541992647.jpg',
    'male',
    '41-bcs-0004@kdu.ac.lk',
    '123456789V',
    '0769280577',
    '786/5 , Thelwatta Rd, Negombo',
    '',
    '',
    '',
    '',
    '',
    '2025',
    '2025-11-14 10:17:24'
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
    `curriculum`,
    `description`,
    `courseBanner`,
    `grade`
  )
VALUES
  (
    'C627',
    'Computer Science',
    4000.00,
    'general',
    'Computer Science introduces students to the fundamentals of computing, programming, and digital literacy. It focuses on building a strong foundation in how computers work.',
    '',
    '4'
  );
INSERT INTO
  `modules` (
    `module_id`,
    `name`,
    `payment`,
    `curriculum`,
    `description`,
    `courseBanner`,
    `grade`
  )
VALUES
  (
    'M001',
    'Chemistry',
    NULL,
    'cambridge',
    NULL,
    NULL,
    '9'
  );
INSERT INTO
  `modules` (
    `module_id`,
    `name`,
    `payment`,
    `curriculum`,
    `description`,
    `courseBanner`,
    `grade`
  )
VALUES
  ('M002', 'Physics', 4000.00, 'cambridge', '', '', '9');
INSERT INTO
  `modules` (
    `module_id`,
    `name`,
    `payment`,
    `curriculum`,
    `description`,
    `courseBanner`,
    `grade`
  )
VALUES
  ('M003', 'Maths', NULL, 'general', NULL, NULL, '8');

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
    `created_at`,
    `lecturer_id`
  )
VALUES
  (
    '20250930-AOEEVF',
    'Dhyan Sandaru',
    'S2022A_L001',
    'Chemistry',
    'Ishara Sanjula',
    4000.00,
    '2025-09-30 15:55:21',
    NULL
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`,
    `lecturer_id`
  )
VALUES
  (
    '20250930-PF1JUX',
    'Dhyan Sandaru',
    'S2022A_L001',
    'Chemistry',
    'Ishara Sanjula',
    1000.00,
    '2025-09-30 15:47:28',
    NULL
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`,
    `lecturer_id`
  )
VALUES
  (
    '20250930-TDQ7P5',
    'Dhyan Sandaru',
    'S2022A_L001',
    'Chemistry',
    'Ishara Sanjula',
    400.00,
    '2025-09-30 15:32:45',
    NULL
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`,
    `lecturer_id`
  )
VALUES
  (
    '20251002-SU5TG9',
    'V.P. Akila Jayasinghe',
    'S2022A_L002',
    'Chemistry',
    'Ishara Sanjula',
    4000.00,
    '2025-10-02 08:27:33',
    NULL
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`,
    `lecturer_id`
  )
VALUES
  (
    '20251007-Q7FJ34',
    'Yogarajah Gowreesan',
    'S2022A_L003',
    'Chemistry',
    'Ishara Sanjula',
    5000.00,
    '2025-10-07 09:15:10',
    NULL
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`,
    `lecturer_id`
  )
VALUES
  (
    '20251014-LP9J8U',
    'Dhyan Sandaru',
    'S2022A_L001',
    'Chemistry',
    'Ishara Sanjula',
    10000.00,
    '2025-10-14 16:01:19',
    NULL
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`,
    `lecturer_id`
  )
VALUES
  (
    '20251022-3BKUYU',
    'Dhyan Sandaru',
    'S-2022-001',
    'Physics',
    'Kamal Nuwan',
    5000.00,
    '2025-10-22 12:27:54',
    'L2022O_L001'
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`,
    `lecturer_id`
  )
VALUES
  (
    '20251113-DSKLJK',
    'Dhyan Sandaru',
    'S-2022-001',
    'Physics',
    'Kamal Nuwan',
    10000.00,
    '2025-11-13 15:57:09',
    'L2022O_L001'
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`,
    `lecturer_id`
  )
VALUES
  (
    '20251113-Z9NAPR',
    'Dhyan Sandaru',
    'S-2022-001',
    'Physics',
    'Kamal Nuwan',
    10000.00,
    '2025-11-13 15:47:24',
    'L2022O_L001'
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`,
    `lecturer_id`
  )
VALUES
  (
    '20251114-QG42AN',
    'Dhyan Sandaru',
    'S-2022-001',
    'Physics',
    'Kamal Nuwan',
    3000.00,
    '2025-11-14 10:18:48',
    'L2022O_L001'
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`,
    `lecturer_id`
  )
VALUES
  (
    '20251114-T3NW49',
    'Dhyan Sandaru',
    'S-2022-001',
    'Physics',
    'Kamal Nuwan',
    3000.00,
    '2025-11-14 10:18:49',
    'L2022O_L001'
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`,
    `lecturer_id`
  )
VALUES
  (
    '20251114-W7C192',
    'Dhyan Sandaru',
    'S-2022-001',
    'Physics',
    'Kamal Nuwan',
    3000.00,
    '2025-11-14 10:18:45',
    'L2022O_L001'
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`,
    `lecturer_id`
  )
VALUES
  (
    'PAY-20250922-GPVQF9',
    'Dhyan Sandaru',
    'S2022A_L001',
    'Maths',
    'Kamal Nuwan',
    6000.00,
    '2025-09-22 23:54:24',
    'L2022O_L001'
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`,
    `lecturer_id`
  )
VALUES
  (
    'PAY-20250923-O0I71H',
    'Saman Kumara',
    'S2023A_L001',
    'Maths',
    'Ishara Sanjula',
    6000.00,
    '2025-09-23 11:11:31',
    NULL
  );
INSERT INTO
  `payments` (
    `ref_no`,
    `student_name`,
    `student_id`,
    `course_module`,
    `lecturer`,
    `amount`,
    `created_at`,
    `lecturer_id`
  )
VALUES
  (
    'PAY-20250924-Q7MO3N',
    'Albert Hans',
    'S2024A_L001',
    'Physics',
    'Ishara Sanjula',
    5000.00,
    '2025-09-24 09:07:42',
    NULL
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
    '50AAd',
    1,
    '2025-11-13 15:36:42',
    '2025-11-13 15:51:43'
  );
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
    'H8x0w',
    1,
    '2026-03-15 21:36:28',
    '2026-03-15 21:51:28'
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
    'nVcpt',
    1,
    '2026-01-11 16:57:03',
    '2026-01-11 17:12:03'
  );
INSERT INTO
  `registration_codes` (`code`, `used`, `created_at`, `expires_at`)
VALUES
  (
    'P9ntF',
    1,
    '2026-01-28 11:41:36',
    '2026-01-28 11:56:37'
  );
INSERT INTO
  `registration_codes` (`code`, `used`, `created_at`, `expires_at`)
VALUES
  (
    'pcOgJ',
    1,
    '2025-11-14 10:07:56',
    '2025-11-14 10:22:56'
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
    'WAWVA',
    1,
    '2026-01-11 16:42:12',
    '2026-01-11 16:57:12'
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
INSERT INTO
  `student_modules` (`id`, `student_id`, `module_id`)
VALUES
  (6, 'S-2024-001', 'C627');
INSERT INTO
  `student_modules` (`id`, `student_id`, `module_id`)
VALUES
  (7, 'S-2025-002', 'M001');
INSERT INTO
  `student_modules` (`id`, `student_id`, `module_id`)
VALUES
  (9, 'S-2026-001', 'C627');
INSERT INTO
  `student_modules` (`id`, `student_id`, `module_id`)
VALUES
  (10, 'S-2028-001', 'M003');
INSERT INTO
  `student_modules` (`id`, `student_id`, `module_id`)
VALUES
  (11, 'S-2028-001', 'M002');
INSERT INTO
  `student_modules` (`id`, `student_id`, `module_id`)
VALUES
  (13, 'S-2028-002', 'M001');

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
    9,
    'S-2024-001',
    'Sample Student',
    '',
    'Male',
    '2004-01-09',
    'Sinhala',
    'O/L',
    '2025',
    'ishanrandika@gmail.com',
    '199257985678',
    '0724567890',
    '786/5 , Thelwatta Rd, Negombo',
    'jfsensetu',
    '0119119110',
    'Father',
    'UOM',
    '11',
    '2025-11-14',
    'Pending',
    22
  );
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
    11,
    'S-2025-002',
    'Maithreepala Sirisena',
    NULL,
    'Male',
    '1990-10-30',
    'Sinhala',
    'A/L',
    '2025',
    'my3@gmail.com',
    '19657856490',
    '0718956983',
    'Polonnaruwa',
    'M.A.S.Sirisena',
    '778951904',
    'Daughter',
    '',
    '',
    '2025-12-11',
    'Pending',
    35
  );
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
    12,
    'S-2026-001',
    'Chamath Randeera',
    '/students/1768130958733-559801650.jpg',
    'Male',
    '2001-10-10',
    'Sri Lankan',
    'A/L',
    '2026',
    'chamathrandheera@gmail.com',
    '20017856789',
    '0763958120',
    'St. Anne\'s Road, Kattimahana',
    'S.A.K.Randheera',
    '0764978190',
    'Father',
    'Central College Kattimahana',
    '11',
    '2026-01-25',
    'Pending',
    24
  );
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
    13,
    'S-2028-001',
    'Siluni',
    '/students/1773590904486-886098146.png',
    'Female',
    '2007-09-19',
    'Sinhala',
    'A/L',
    '2028',
    'siluni@gmail.com',
    '20075645679',
    '0761865294',
    'Dummalasuriya',
    'W.A.D.S.Wickrama Arachchi',
    '0776521856',
    'Brother',
    'Cck',
    '12',
    '2026-03-15',
    'Pending',
    18
  );
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
    16,
    'S-2028-002',
    'Sample Student2',
    '/students/1773740884513-366672382.jpg',
    'Male',
    '2005-03-15',
    'Muslim',
    'O/L',
    '2028',
    'samplestudent1@gmail.com',
    '20056809348',
    '-14567082',
    '32,Kandy Road,Kurunegala',
    'R.A.S.D. Suraweera',
    '0743916345',
    'Father',
    'Sample School',
    'Grade 6',
    '2026-03-17',
    'Pending',
    21
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
    `module_id`
  )
VALUES
  (
    6,
    '2025-10-20',
    'Sunday',
    '11:00:00',
    '13:00:00',
    'M003'
  );
INSERT INTO
  `timetable` (
    `id`,
    `date`,
    `day`,
    `start_time`,
    `end_time`,
    `module_id`
  )
VALUES
  (
    7,
    '2025-10-19',
    'Sunday',
    '09:00:00',
    '11:00:00',
    'M002'
  );
INSERT INTO
  `timetable` (
    `id`,
    `date`,
    `day`,
    `start_time`,
    `end_time`,
    `module_id`
  )
VALUES
  (
    8,
    '2025-10-21',
    'Monday',
    '11:00:00',
    '14:00:00',
    'C627'
  );
INSERT INTO
  `timetable` (
    `id`,
    `date`,
    `day`,
    `start_time`,
    `end_time`,
    `module_id`
  )
VALUES
  (
    9,
    '2025-11-12',
    'Wednesday',
    '09:00:00',
    '10:30:00',
    'M002'
  );
INSERT INTO
  `timetable` (
    `id`,
    `date`,
    `day`,
    `start_time`,
    `end_time`,
    `module_id`
  )
VALUES
  (
    12,
    '2025-11-14',
    'Friday',
    '10:00:00',
    '11:30:00',
    'M001'
  );
INSERT INTO
  `timetable` (
    `id`,
    `date`,
    `day`,
    `start_time`,
    `end_time`,
    `module_id`
  )
VALUES
  (
    13,
    '2026-03-26',
    'Thursday',
    '09:00:00',
    '11:00:00',
    'C627'
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
