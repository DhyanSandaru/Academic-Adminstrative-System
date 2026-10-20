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
) ENGINE = InnoDB AUTO_INCREMENT = 49 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  `curriculum` varchar(25) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `nic` (`nic`)
) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB AUTO_INCREMENT = 33 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  `curriculum` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_id` (`student_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 25 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  PRIMARY KEY (`id`),
  KEY `idx_date` (`date`)
) ENGINE = InnoDB AUTO_INCREMENT = 24 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
    '2026-08-22 13:56:40',
    '2025-11-14 04:50:22',
    '2026-08-22 13:56:40'
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
  (42, 'L-2026-002', 'C627');
INSERT INTO
  `lecturer_modules` (`id`, `lecturer_id`, `module_id`)
VALUES
  (43, 'L-2026-002', 'M001');
INSERT INTO
  `lecturer_modules` (`id`, `lecturer_id`, `module_id`)
VALUES
  (44, 'L-2026-001', 'G410');
INSERT INTO
  `lecturer_modules` (`id`, `lecturer_id`, `module_id`)
VALUES
  (45, 'L-2026-001', 'M001');
INSERT INTO
  `lecturer_modules` (`id`, `lecturer_id`, `module_id`)
VALUES
  (46, 'L-2026-001', 'M003');
INSERT INTO
  `lecturer_modules` (`id`, `lecturer_id`, `module_id`)
VALUES
  (47, 'L-2026-003', 'M002');
INSERT INTO
  `lecturer_modules` (`id`, `lecturer_id`, `module_id`)
VALUES
  (48, 'L-2026-003', 'H192');

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
    'L-2026-001',
    'I.G.S.B. Rupasinghe',
    '/public/lecturers/1787317787863-532115057.png',
    'Male',
    'sankharupasinghe@gmail.com',
    '20026758128',
    '0703334512',
    'galewela, Dabulla',
    'Bcs Hons in Sofware Engineering',
    'Genral Sir John Kotelawala Defence University',
    'software engineering',
    '1',
    'Damma Pasal Certificate',
    '2026',
    '2026-08-04 20:13:37'
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
    'L-2026-002',
    'Adam Sandler',
    '/public/lecturers/1787318463774-492459286.png',
    'Male',
    'adamsandler@gmail.com',
    '200184786747',
    '0765689340',
    'No:456, Galle',
    'Bsc in Chemistry',
    'University of Kelaniya',
    'software engineering',
    '3',
    '',
    '2026',
    '2026-08-21 18:51:04'
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
    'L-2026-003',
    'sample lecturer2',
    '/public/lecturers/1787390271893-832063481.jpg',
    'Female',
    'samplelecturer2@gmail.com',
    '200346789012',
    '0725647890',
    'sample street, sample city',
    'Bsc in Chemistry',
    'University of Kelaniya',
    'software engineering',
    '3',
    'none',
    '2026',
    '2026-08-22 14:47:52'
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
    '/images/course_backgrounds/abstract_art2.png',
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
    'G410',
    'Geography',
    30000.00,
    'edexcel',
    'very good',
    '/images/course_backgrounds/space-art.jpg',
    '10'
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
    'H192',
    'History',
    6000.00,
    'general',
    'Teaching history for grade 8 general students',
    '/images/course_backgrounds/tides.jpg',
    '8'
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
    0.00,
    'cambridge',
    '',
    '/images/course_backgrounds/abstract_art.jpg',
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
  (
    'M002',
    'Physics',
    4000.00,
    'cambridge',
    '',
    '/images/course_backgrounds/tides.jpg',
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
  (
    'M003',
    'Maths',
    0.00,
    'general',
    '',
    '/images/course_backgrounds/gold-brown tiles.jpg',
    '8'
  );

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
    '20260804-RR9VX1',
    'K.K.G.Sachila Hansana',
    'S-26E08-001',
    'G410',
    'I.G.S.B. Rupasinghe',
    10000.00,
    '2026-08-04 20:14:56',
    'L-2026-001'
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
    '20260822-365EU7',
    'K.K.G.Sachila Hansana',
    'S-26E08-001',
    'M001',
    'Adam Sandler',
    5000.00,
    '2026-08-22 15:05:05',
    'L-2026-002'
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
    '20260822-K221CX',
    'K.K.G.Sachila Hansana',
    'S-26E08-001',
    'M001',
    'Adam Sandler',
    5000.00,
    '2026-08-22 15:18:55',
    'L-2026-002'
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
    'oBIKK',
    1,
    '2026-08-16 18:36:23',
    '2026-08-16 18:51:24'
  );
INSERT INTO
  `registration_codes` (`code`, `used`, `created_at`, `expires_at`)
VALUES
  (
    'YpM31',
    0,
    '2026-08-16 18:23:54',
    '2026-08-16 18:38:54'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: student_modules
# ------------------------------------------------------------

INSERT INTO
  `student_modules` (`id`, `student_id`, `module_id`)
VALUES
  (27, 'S-26C08-001', 'C627');
INSERT INTO
  `student_modules` (`id`, `student_id`, `module_id`)
VALUES
  (28, 'S-26C08-002', 'M001');
INSERT INTO
  `student_modules` (`id`, `student_id`, `module_id`)
VALUES
  (29, 'S-26C08-002', 'M003');
INSERT INTO
  `student_modules` (`id`, `student_id`, `module_id`)
VALUES
  (30, 'S-26C08-003', 'C627');
INSERT INTO
  `student_modules` (`id`, `student_id`, `module_id`)
VALUES
  (31, 'S-26E08-001', 'G410');
INSERT INTO
  `student_modules` (`id`, `student_id`, `module_id`)
VALUES
  (32, 'S-26E08-001', 'M001');

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
    `age`,
    `curriculum`
  )
VALUES
  (
    21,
    'S-26E08-001',
    'K.K.G.Sachila Hansana',
    '/public/students/1785853931806-583296710.jpg',
    'Male',
    '2002-12-17',
    'sinhala',
    'sachilahansana45@gmail.com',
    '200235502529',
    '0766398612',
    'Galle',
    'Chamathka Gawarammana',
    '0778956789',
    'Father',
    'Mahinda College Galle',
    '10',
    '2026-08-04',
    'Paid',
    23,
    'edexcel'
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
    `age`,
    `curriculum`
  )
VALUES
  (
    22,
    'S-26C08-001',
    'Tom Clancy',
    '/public/students/1787160085844-544313207.jpeg',
    'Male',
    '2002-08-10',
    'sinhala',
    'tomclancy@gmail.com',
    '200256787804',
    '0768956783',
    'No. 40, Samagi street, Rathmalana',
    'John Clancy',
    '0767839781',
    'Father',
    'KDU',
    '9',
    '2026-08-19',
    'Pending',
    24,
    'cambridge'
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
    `age`,
    `curriculum`
  )
VALUES
  (
    23,
    'S-26C08-002',
    'sample student1',
    '/public/students/1787343109033-573499950.png',
    'Male',
    '2001-10-24',
    'sinhala',
    'sampleuser1234@gmail.com',
    '200256785678',
    '0756798678',
    'Sample street, sample city',
    'sample parent',
    '0756789769',
    'Father',
    'SLIIT',
    '10',
    '2026-08-21',
    'Pending',
    24,
    'cambridge'
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
    `age`,
    `curriculum`
  )
VALUES
  (
    24,
    'S-26C08-003',
    'Sample student2',
    '/public/students/1787343561838-203135094.jpg',
    'Male',
    '2003-09-18',
    'sinhala',
    'sampleuser2@gmail.com',
    '200356765437',
    '0769458368',
    'Sample street, sample province',
    'Sample mother',
    '0715864258',
    'Mother',
    'IIT',
    '10',
    '2026-08-21',
    'Pending',
    22,
    'cambridge'
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
    14,
    '2026-08-20',
    'Friday',
    '09:00:00',
    '11:00:00',
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
    15,
    '2026-08-17',
    'Monday',
    '10:00:00',
    '11:30:00',
    'G410'
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
    16,
    '2026-08-18',
    'Tuesday',
    '08:00:00',
    '11:00:00',
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
    17,
    '2026-08-21',
    'Thursday',
    '10:00:00',
    '12:00:00',
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
    18,
    '2026-08-22',
    'Saturday',
    '09:00:00',
    '12:00:00',
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
    19,
    '2026-08-27',
    'Thursday',
    '09:00:00',
    '11:00:00',
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
    20,
    '2026-08-24',
    'Monday',
    '10:00:00',
    '11:30:00',
    'G410'
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
    21,
    '2026-08-25',
    'Tuesday',
    '08:00:00',
    '11:00:00',
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
    22,
    '2026-08-28',
    'Friday',
    '10:00:00',
    '12:00:00',
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
    23,
    '2026-08-29',
    'Saturday',
    '09:00:00',
    '12:00:00',
    'C627'
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
