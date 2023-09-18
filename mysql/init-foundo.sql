-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: foundo
-- ------------------------------------------------------
-- Server version	8.0.30

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
-- Table structure for table `items`
--

DROP DATABASE IF EXISTS foundo;

CREATE DATABASE foundo;

USE foundo;


DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `itemName` varchar(30) NOT NULL,
  `color` varchar(20) NOT NULL,
  `dateTime` date NOT NULL,
  `description` text NOT NULL,
  `brand` varchar(30) DEFAULT NULL,
  `city` varchar(30) NOT NULL,
  `category` varchar(30) NOT NULL,
  `userId` int DEFAULT NULL,
  `isFounded` tinyint(1) DEFAULT '0',
  `college` varchar(30) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `thumbnail` longtext,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `items_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (2,'Samsung S21','black','2022-10-10','Lost at park near Connaught Place, Delhi','Samsung','Delhi','mobile phone',4,0,NULL,'2023-01-20 10:59:41','https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/CL9R-id-3.jpeg'),(3,'Headphones','silver','2022-10-10','Left on train from Mumbai to Pune','Sony','Mumbai','headphone',5,0,NULL,'2023-01-20 11:04:42','https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/nuu1-id-5.jpeg'),(4,'Laptop','gray','2022-10-10','Lost at coffee shop in Bangalore','Lenovo','Bangalore','laptop',3,0,NULL,'2023-01-20 11:07:28','https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/bF9w-id-7.jpeg'),(5,'Fastrack Watch','white','2022-10-10','Misplaced at gym in Kolkata','Fastrack','Kolkata','watches',5,0,NULL,'2023-01-20 11:10:48','https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/YCyj-id-9.jpeg'),(6,'Maroon Handbag','maroon','2022-10-10','Left at mall in Hyderabad','Indian brand','Hyderabad','handbag',6,0,NULL,'2023-01-20 11:15:07','https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/ageZ-id-11.jpeg');
INSERT INTO `items` VALUES (7,'Purple Sunglasses','purple','2022-10-10','Found at beach in Goa. Owner can claim at tourist information center with identification','Ray-Ban','Goa','sunglasses',7,1,NULL,'2023-01-20 11:17:50','https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/oqpW-id-13.jpeg'),(8,'Fuchsia Sandals','fuchsia','2022-10-10','Found at temple in Jaipur. Owner can contact through phone number provided','Indian brand','Jaipur','sandals',9,1,NULL,'2023-01-20 11:21:04','https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/KFs5-id-16.jpeg'),(9,'Power Bank','lime','2022-10-10','Found in taxi in Ahmedabad. Owner can contact through phone number provided','Chinese brand','Ahmedabad','power bank',8,1,NULL,'2023-01-20 11:24:03','https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/v4BP-id-17.jpeg'),(10,'Green Wallet','olive','2022-10-10','Found at market in Surat. Owner can contact through email provided','Indian brand','Surat','wallet',10,1,NULL,'2023-01-20 11:26:51','https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/tLTS-id-20.webp');

/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itemslocations`
--

DROP TABLE IF EXISTS `itemslocations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itemslocations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lostItemId` int DEFAULT NULL,
  `foundItemId` int DEFAULT NULL,
  `latitude` float(18,6) NOT NULL,
  `longitude` float(18,6) NOT NULL,
  `messageId` int DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `lostItemId` (`lostItemId`),
  KEY `foundItemId` (`foundItemId`),
  KEY `messageId` (`messageId`),
  CONSTRAINT `itemslocations_ibfk_1` FOREIGN KEY (`lostItemId`) REFERENCES `items` (`id`),
  CONSTRAINT `itemslocations_ibfk_2` FOREIGN KEY (`foundItemId`) REFERENCES `items` (`id`),
  CONSTRAINT `itemslocations_ibfk_3` FOREIGN KEY (`messageId`) REFERENCES `messages` (`id`),
  CONSTRAINT `messageId` FOREIGN KEY (`messageId`) REFERENCES `messages` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemslocations`
--

LOCK TABLES `itemslocations` WRITE;
/*!40000 ALTER TABLE `itemslocations` DISABLE KEYS */;
INSERT INTO `itemslocations` VALUES (2,2,NULL,28.704060,77.102440,NULL,'2023-01-20 10:59:42'),(4,3,NULL,18.938770,72.835335,NULL,'2023-01-20 11:04:44'),(5,4,NULL,12.972442,77.580643,NULL,'2023-01-20 11:07:30'),(6,5,NULL,22.572645,88.363892,NULL,'2023-01-20 11:10:49'),(7,6,NULL,17.385044,78.486671,NULL,'2023-01-20 11:15:08'),(8,NULL,7,15.299326,74.123993,NULL,'2023-01-20 11:17:52'),(9,NULL,8,26.912434,75.787270,NULL,'2023-01-20 11:21:05'),(10,NULL,9,23.022505,72.571365,NULL,'2023-01-20 11:24:04'),(11,NULL,10,21.170240,72.831062,NULL,'2023-01-20 11:26:52');
/*!40000 ALTER TABLE `itemslocations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itemspictures`
--

DROP TABLE IF EXISTS `itemspictures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itemspictures` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lostItemId` int DEFAULT NULL,
  `foundItemId` int DEFAULT NULL,
  `url` longtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `lostItemId` (`lostItemId`),
  KEY `foundItemId` (`foundItemId`),
  CONSTRAINT `itemspictures_ibfk_1` FOREIGN KEY (`lostItemId`) REFERENCES `items` (`id`),
  CONSTRAINT `itemspictures_ibfk_2` FOREIGN KEY (`foundItemId`) REFERENCES `items` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemspictures`
--

LOCK TABLES `itemspictures` WRITE;
/*!40000 ALTER TABLE `itemspictures` DISABLE KEYS */;
INSERT INTO `itemspictures` VALUES (3,2,NULL,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/CL9R-id-3.jpeg'),(4,2,NULL,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/0YgH-id-4.jpeg'),(5,3,NULL,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/nuu1-id-5.jpeg'),(6,3,NULL,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/9UE7-id-6.jpeg'),(7,4,NULL,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/bF9w-id-7.jpeg'),(8,4,NULL,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/1LML-id-8.jpeg'),(9,5,NULL,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/YCyj-id-9.jpeg'),(10,5,NULL,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/wYIt-id-10.jpeg'),(11,6,NULL,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/ageZ-id-11.jpeg'),(12,6,NULL,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/A5GP-id-12.jpeg'),(13,NULL,7,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/oqpW-id-13.jpeg'),(14,NULL,7,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/sHSp-id-14.jpeg'),(15,NULL,8,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/9htV-id-15.jpeg'),(16,NULL,8,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/KFs5-id-16.jpeg'),(17,NULL,9,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/v4BP-id-17.jpeg'),(18,NULL,9,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/ZLun-id-18.jpeg'),(19,NULL,10,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/V2yj-id-19.jpeg'),(20,NULL,10,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/tLTS-id-20.webp');
/*!40000 ALTER TABLE `itemspictures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `senderId` int DEFAULT NULL,
  `receiverId` int DEFAULT NULL,
  `title` text,
  `message` text,
  `isFound` int NOT NULL,
  `isPhoneNoShared` int DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (2,4,8,'I found some thing you know','Lolllll ?? Chinese ',0,0,'2023-01-20 11:30:10'),(3,1,4,'Lolos','Sndkdkdodndne',0,0,'2023-01-20 11:30:52'),(4,1,3,'Sjsiso','Sisisososomx',1,1,'2023-01-26 13:54:07'),(5,1,4,'Snskskdndid','Xhdjwiekdnccndj',1,1,'2023-01-26 13:54:57'),(6,1,4,'Sjsiwoskdn','Dnsjskdkskdmxnndjdksk',1,0,'2023-01-26 14:11:16'),(7,4,1,'Jwkss','Dkssksksdnbd ddhdk',1,0,'2023-01-26 14:12:59'),(8,4,1,'Sjsisisi','Sjsisoseke',1,0,'2023-01-26 15:20:15'),(9,4,1,'Nznzkssksm','Zmmzkzsmskdmd',1,0,'2023-01-26 15:21:13'),(10,4,4,'Bssmskslsl','Nxskkskssos',1,1,'2023-01-26 15:26:48'),(11,1,7,'Fkvd','Fjjfhejs djdjd js DJ\'s sjds sjssjssjd sjs sjs ',0,0,'2023-01-30 04:54:23');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `email` varchar(35) NOT NULL,
  `password` longtext,
  `phoneNo` varchar(20) DEFAULT NULL,
  `countryCode` varchar(10) DEFAULT NULL,
  `profilePhoto` longtext,
  `address` text,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_verified` tinyint(1) DEFAULT '0',
  `otp` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Kushagra','Rathore','kushagrarathore002@gmail.com','$2b$10$/c4ZhKZOK5tw7/LJJHUNAOcxUqzdIck9DB30NDsfCgxb7KbttN/7m','+919764811688',NULL,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/profilePhoto/ae14-id-1.jpeg','451001, Shahpura, Madhya Pradesh, India','2023-01-19 09:02:29',1,0),(2,'John','Doe','Johndoe@example.com','$2b$10$6YQ5vbqdqst90WGfAoHBKudwJjmpLX7fg6jE3543ONfkk2.N9q4y6',NULL,NULL,NULL,NULL,'2023-01-20 07:59:01',0,0),(3,'Jane','Smith','Janesmith@example.com','$2b$10$yNivmoCzu04RwEpXhYa7M.aXIJXSTADb5u9f49Au06LHgIXfil.ba',NULL,NULL,NULL,NULL,'2023-01-20 07:59:26',0,0),(4,'Rohan','Sharma','rohansharma@gmail.com','$2b$10$dBsu4RyU6/X8it8vxYeZe.GFe2VtPgZlLPcc1/glem6ixm1OdGRBO',NULL,NULL,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/tGQp-user-id-4.jpeg','453331, Indore, Indore Division, Madhya Pradesh, India','2023-01-20 08:02:47',0,0),(5,'Priya','Gupta','priyagupta@gmail.com','$2b$10$tNSU/6ucY790.hVf1r0csOj.wcIFP2X.KN4kzjXq5fFpaJEmJgkqO',NULL,NULL,NULL,NULL,'2023-01-20 08:03:19',0,0),(6,'Anjali','Rao','anjalirao@gamil.com','$2b$10$B/a1KuXVwEOfyqiPMPlvbOvhlB/OKJUBgr2bCv9p4XuQ0GxgreZ5W',NULL,NULL,NULL,NULL,'2023-01-20 08:04:01',0,0),(7,'Vikram','Kumar','vikramkumar@gmail.com','$2b$10$VHSiZIBTjDztYx9J2ZAGSOCx27iPnpkjxjkSSbTgeDtvCT1jDYlCq',NULL,NULL,NULL,NULL,'2023-01-20 08:04:22',0,0),(8,'Sachin','Mishra','sachinmishra@gmail.com','$2b$10$6df/5kxL5b4fVI2V2fiITeI2PkcujEvkTitO89cK49/gJYbsBjzly',NULL,NULL,NULL,NULL,'2023-01-20 08:04:56',0,0),(9,'Sonal','Chauhan','sonalchauhan@gmail.com','$2b$10$WTMiFyIrLIXsNTSlVF4mK.rHz97FBK.NADpePCnJnPsBNqXzJHUlu',NULL,NULL,NULL,NULL,'2023-01-20 08:05:23',0,0),(10,'Rajesh','Verma','rajeshverma@gmail.com','$2b$10$mLKwdO4aR4BSC1YnpHPA8OdUMBENhwXyuDJKRLrB32ERQ7m.GabSC',NULL,NULL,NULL,NULL,'2023-01-20 08:05:40',0,0),(11,'Nidhi','Patel','nidhipatel@gmail.com','$2b$10$tbtqvT/v5vtSXgy.rhTWrescTGpCOwUjLO.9HgScpqu7YcZcziYay',NULL,NULL,NULL,NULL,'2023-01-20 08:06:09',0,0),(12,'Aditya','Jain','adityajain@gmail.com','$2b$10$1UsXTnBEsCacrC/zRBFDGuVHPlMnm9Tv/F/0yjXV7cG.RjLaBXyxq',NULL,NULL,NULL,NULL,'2023-01-20 08:06:43',0,0),(13,'Neha','Goyal','nehagoyal@gmail.com','$2b$10$2OuQBut0A7ItIK9OzbiziO8GQf.SZwfSpSSS74FZKkprD.g5xhjjG',NULL,NULL,NULL,NULL,'2023-01-20 08:07:03',0,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userssettings`
--

DROP TABLE IF EXISTS `userssettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userssettings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `language` varchar(20) DEFAULT 'eng',
  `displayPhoneNo` tinyint(1) DEFAULT '0',
  `displayProfilePhoto` tinyint(1) DEFAULT '1',
  `displayAddress` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `userssettings_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userssettings`
--

LOCK TABLES `userssettings` WRITE;
/*!40000 ALTER TABLE `userssettings` DISABLE KEYS */;
INSERT INTO `userssettings` VALUES (1,1,'eng',0,0,0),(2,2,'eng',0,1,0),(3,3,'eng',0,1,0),(4,4,'eng',0,1,0),(5,5,'eng',0,1,0),(6,6,'eng',0,1,0),(7,7,'eng',0,1,0),(8,8,'eng',0,1,0),(9,9,'eng',0,1,0),(10,10,'eng',0,1,0),(11,11,'eng',0,1,0),(12,12,'eng',0,1,0),(13,13,'eng',0,1,0);
/*!40000 ALTER TABLE `userssettings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-18  2:18:25
