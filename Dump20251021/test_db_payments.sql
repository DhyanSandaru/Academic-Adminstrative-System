-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: test_db
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `ref_no` varchar(20) NOT NULL,
  `student_name` varchar(100) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `course_module` varchar(100) NOT NULL,
  `lecturer` varchar(100) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ref_no`),
  UNIQUE KEY `ref_no` (`ref_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES ('20250930-AOEEVF','Dhyan Sandaru','S2022A_L001','Chemistry','Ishara Sanjula',4000.00,'2025-09-30 10:25:21'),('20250930-PF1JUX','Dhyan Sandaru','S2022A_L001','Chemistry','Ishara Sanjula',1000.00,'2025-09-30 10:17:28'),('20250930-TDQ7P5','Dhyan Sandaru','S2022A_L001','Chemistry','Ishara Sanjula',400.00,'2025-09-30 10:02:45'),('20251002-SU5TG9','V.P. Akila Jayasinghe','S2022A_L002','Chemistry','Ishara Sanjula',4000.00,'2025-10-02 02:57:33'),('20251007-Q7FJ34','Yogarajah Gowreesan','S2022A_L003','Chemistry','Ishara Sanjula',5000.00,'2025-10-07 03:45:10'),('20251014-LP9J8U','Dhyan Sandaru','S2022A_L001','Chemistry','Ishara Sanjula',10000.00,'2025-10-14 10:31:19'),('PAY-20250922-GPVQF9','Dhyan Sandaru','S2022A_L001','Maths','Kamal Nuwan',6000.00,'2025-09-22 18:24:24'),('PAY-20250923-O0I71H','Saman Kumara','S2023A_L001','Maths','Ishara Sanjula',6000.00,'2025-09-23 05:41:31'),('PAY-20250924-Q7MO3N','Albert Hans','S2024A_L001','Physics','Ishara Sanjula',5000.00,'2025-09-24 03:37:42');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-21 16:08:31
