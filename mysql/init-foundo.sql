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
-- Table structure for table `item`
--

DROP DATABASE IF EXISTS foundo;

CREATE DATABASE foundo;

USE foundo;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
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
  `isVerified` tinyint(1) DEFAULT '0',
  `otp` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Kushagra','Rathore','kushagrarathore002@gmail.com','$2b$10$/c4ZhKZOK5tw7/LJJHUNAOcxUqzdIck9DB30NDsfCgxb7KbttN/7m','+919764811688',NULL,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/profilePhoto/ae14-id-1.jpeg','451001, Shahpura, Madhya Pradesh, India','2023-01-19 09:02:29',1,0),(2,'John','Doe','Johndoe@example.com','$2b$10$6YQ5vbqdqst90WGfAoHBKudwJjmpLX7fg6jE3543ONfkk2.N9q4y6',NULL,NULL,NULL,NULL,'2023-01-20 07:59:01',0,0),(3,'Jane','Smith','Janesmith@example.com','$2b$10$yNivmoCzu04RwEpXhYa7M.aXIJXSTADb5u9f49Au06LHgIXfil.ba',NULL,NULL,NULL,NULL,'2023-01-20 07:59:26',0,0),(4,'Rohan','Sharma','rohansharma@gmail.com','$2b$10$dBsu4RyU6/X8it8vxYeZe.GFe2VtPgZlLPcc1/glem6ixm1OdGRBO',NULL,NULL,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/tGQp-user-id-4.jpeg','453331, Indore, Indore Division, Madhya Pradesh, India','2023-01-20 08:02:47',0,0),(5,'Priya','Gupta','priyagupta@gmail.com','$2b$10$tNSU/6ucY790.hVf1r0csOj.wcIFP2X.KN4kzjXq5fFpaJEmJgkqO',NULL,NULL,NULL,NULL,'2023-01-20 08:03:19',0,0),(6,'Anjali','Rao','anjalirao@gamil.com','$2b$10$B/a1KuXVwEOfyqiPMPlvbOvhlB/OKJUBgr2bCv9p4XuQ0GxgreZ5W',NULL,NULL,NULL,NULL,'2023-01-20 08:04:01',0,0),(7,'Vikram','Kumar','vikramkumar@gmail.com','$2b$10$VHSiZIBTjDztYx9J2ZAGSOCx27iPnpkjxjkSSbTgeDtvCT1jDYlCq',NULL,NULL,NULL,NULL,'2023-01-20 08:04:22',0,0),(8,'Sachin','Mishra','sachinmishra@gmail.com','$2b$10$6df/5kxL5b4fVI2V2fiITeI2PkcujEvkTitO89cK49/gJYbsBjzly',NULL,NULL,NULL,NULL,'2023-01-20 08:04:56',0,0),(9,'Sonal','Chauhan','sonalchauhan@gmail.com','$2b$10$WTMiFyIrLIXsNTSlVF4mK.rHz97FBK.NADpePCnJnPsBNqXzJHUlu',NULL,NULL,NULL,NULL,'2023-01-20 08:05:23',0,0),(10,'Rajesh','Verma','rajeshverma@gmail.com','$2b$10$mLKwdO4aR4BSC1YnpHPA8OdUMBENhwXyuDJKRLrB32ERQ7m.GabSC',NULL,NULL,NULL,NULL,'2023-01-20 08:05:40',0,0),(11,'Nidhi','Patel','nidhipatel@gmail.com','$2b$10$tbtqvT/v5vtSXgy.rhTWrescTGpCOwUjLO.9HgScpqu7YcZcziYay',NULL,NULL,NULL,NULL,'2023-01-20 08:06:09',0,0),(12,'Aditya','Jain','adityajain@gmail.com','$2b$10$1UsXTnBEsCacrC/zRBFDGuVHPlMnm9Tv/F/0yjXV7cG.RjLaBXyxq',NULL,NULL,NULL,NULL,'2023-01-20 08:06:43',0,0),(13,'Neha','Goyal','nehagoyal@gmail.com','$2b$10$2OuQBut0A7ItIK9OzbiziO8GQf.SZwfSpSSS74FZKkprD.g5xhjjG',NULL,NULL,NULL,NULL,'2023-01-20 08:07:03',0,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userSetting`
--

DROP TABLE IF EXISTS `userSetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userSetting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_userId` int NOT NULL,
  `language` varchar(20) DEFAULT 'eng',
  `displayPhoneNo` tinyint(1) DEFAULT '0',
  `displayProfilePhoto` tinyint(1) DEFAULT '1',
  `displayAddress` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `fk_userId` (`fk_userId`),
  CONSTRAINT `userSetting_ibfk_1` FOREIGN KEY (`fk_userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userSetting`
--

LOCK TABLES `userSetting` WRITE;
/*!40000 ALTER TABLE `userSetting` DISABLE KEYS */;
INSERT INTO `userSetting` VALUES (1,1,'eng',0,0,0),(2,2,'eng',0,1,0),(3,3,'eng',0,1,0),(4,4,'eng',0,1,0),(5,5,'eng',0,1,0),(6,6,'eng',0,1,0),(7,7,'eng',0,1,0),(8,8,'eng',0,1,0),(9,9,'eng',0,1,0),(10,10,'eng',0,1,0),(11,11,'eng',0,1,0),(12,12,'eng',0,1,0),(13,13,'eng',0,1,0);
/*!40000 ALTER TABLE `userSetting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item`
--


DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `itemName` varchar(30) NOT NULL,
  `color` varchar(20) NOT NULL,
  `dateTime` date NOT NULL,
  `description` text NOT NULL,
  `brand` varchar(30) DEFAULT NULL,
  `city` varchar(30) NOT NULL,
  `category` varchar(30) NOT NULL,
  `fk_userId` int NOT NULL,
  `isFounded` tinyint(1) DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `thumbnail` longtext,
  PRIMARY KEY (`id`),
  KEY `fk_userId` (`fk_userId`),
  CONSTRAINT `item_ibfk_1` FOREIGN KEY (`fk_userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE 
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (2,'Samsung S21','black','2022-10-10','Lost at park near Connaught Place, Delhi','Samsung','Delhi','mobile phone',4,0,'2023-01-20 10:59:41','https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/CL9R-id-3.jpeg'),(3,'Headphones','silver','2022-10-10','Left on train from Mumbai to Pune','Sony','Mumbai','headphone',5,0,'2023-01-20 11:04:42','https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/nuu1-id-5.jpeg'),(4,'Laptop','gray','2022-10-10','Lost at coffee shop in Bangalore','Lenovo','Bangalore','laptop',3,0,'2023-01-20 11:07:28','https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/bF9w-id-7.jpeg'),(5,'Fastrack Watch','white','2022-10-10','Misplaced at gym in Kolkata','Fastrack','Kolkata','watches',5,0,'2023-01-20 11:10:48','https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/YCyj-id-9.jpeg'),(6,'Maroon Handbag','maroon','2022-10-10','Left at mall in Hyderabad','Indian brand','Hyderabad','handbag',6,0,'2023-01-20 11:15:07','https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/ageZ-id-11.jpeg');
INSERT INTO `item` VALUES (7,'Purple Sunglasses','purple','2022-10-10','Found at beach in Goa. Owner can claim at tourist information center with identification','Ray-Ban','Goa','sunglasses',7,1,'2023-01-20 11:17:50','https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/oqpW-id-13.jpeg'),(8,'Fuchsia Sandals','fuchsia','2022-10-10','Found at temple in Jaipur. Owner can contact through phone number provided','Indian brand','Jaipur','sandals',9,1,'2023-01-20 11:21:04','https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/KFs5-id-16.jpeg'),(9,'Power Bank','lime','2022-10-10','Found in taxi in Ahmedabad. Owner can contact through phone number provided','Chinese brand','Ahmedabad','power bank',8,1,'2023-01-20 11:24:03','https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/v4BP-id-17.jpeg'),(10,'Green Wallet','olive','2022-10-10','Found at market in Surat. Owner can contact through email provided','Indian brand','Surat','wallet',10,1,'2023-01-20 11:26:51','https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/tLTS-id-20.webp');

/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `id` int NOT NULL AUTO_INCREMENT,
  `latitude` float(18,6) NOT NULL,
  `longitude` float(18,6) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (2,28.704060,77.102440,'2023-01-20 10:59:42'),(4,18.938770,72.835335,'2023-01-20 11:04:44'),(5,12.972442,77.580643,'2023-01-20 11:07:30'),(6,22.572645,88.363892,'2023-01-20 11:10:49'),(7,17.385044,78.486671,'2023-01-20 11:15:08'),(8,15.299326,74.123993,'2023-01-20 11:17:52'),(9,26.912434,75.787270,'2023-01-20 11:21:05'),(10,23.022505,72.571365,'2023-01-20 11:24:04'),(11,21.170240,72.831062,'2023-01-20 11:26:52');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `itemLocation`
--

DROP TABLE IF EXISTS `itemLocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itemLocation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_itemId` int NOT NULL,
  `fk_locationId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fk_itemId` (`fk_itemId`),
  UNIQUE KEY `fk_locationId` (`fk_locationId`),
  CONSTRAINT `itemLocation_ibfk_1` FOREIGN KEY (`fk_itemId`) REFERENCES `item` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `itemLocation_ibfk_2` FOREIGN KEY (`fk_locationId`) REFERENCES `location` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemLocation`
--

LOCK TABLES `itemLocation` WRITE;
/*!40000 ALTER TABLE `itemLocation` DISABLE KEYS */;
INSERT INTO `itemLocation` VALUES (2,2,2),(3,3,4),(4,4,5),(5,5,6),(6,6,7),(7,7,8),(8,8,9),(9,9,10),(10,10,11);
/*!40000 ALTER TABLE `itemLocation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messageLocation`
--

DROP TABLE IF EXISTS `messageLocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messageLocation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_messageId` int NOT NULL,
  `fk_locationId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fk_messageId` (`fk_messageId`),
  UNIQUE KEY `fk_locationId` (`fk_locationId`),
  CONSTRAINT `messageLocation_ibfk_1` FOREIGN KEY (`fk_messageId`) REFERENCES `message` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `messageLocation_ibfk_2` FOREIGN KEY (`fk_locationId`) REFERENCES `location` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messageLocation`
--

LOCK TABLES `messageLocation` WRITE;
/*!40000 ALTER TABLE `messageLocation` DISABLE KEYS */;
INSERT INTO `messageLocation` VALUES (1,1,2);
/*!40000 ALTER TABLE `messageLocation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itemPicture`
--

DROP TABLE IF EXISTS `itemPicture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itemPicture` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_itemId` int NOT NULL,
  `url` longtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_itemId` (`fk_itemId`),
  CONSTRAINT `itemPicture_ibfk_1` FOREIGN KEY (`fk_itemId`) REFERENCES `item` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemPicture`
--

LOCK TABLES `itemPicture` WRITE;
/*!40000 ALTER TABLE `itemPicture` DISABLE KEYS */;
INSERT INTO `itemPicture` VALUES (3,2,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/CL9R-id-3.jpeg'),(4,2,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/0YgH-id-4.jpeg'),(5,3,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/nuu1-id-5.jpeg'),(6,3,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/9UE7-id-6.jpeg'),(7,4,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/bF9w-id-7.jpeg'),(8,4,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/1LML-id-8.jpeg'),(9,5,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/YCyj-id-9.jpeg'),(10,5,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/wYIt-id-10.jpeg'),(11,6,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/ageZ-id-11.jpeg'),(12,6,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/A5GP-id-12.jpeg'),(13,7,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/oqpW-id-13.jpeg'),(14,7,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/sHSp-id-14.jpeg'),(15,8,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/9htV-id-15.jpeg'),(16,8,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/KFs5-id-16.jpeg'),(17,9,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/v4BP-id-17.jpeg'),(18,9,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/ZLun-id-18.jpeg'),(19,10,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/V2yj-id-19.jpeg'),(20,10,'https://foundo-1-s3.s3.ap-south-1.amazonaws.com/image/foundItems/tLTS-id-20.webp');
/*!40000 ALTER TABLE `itemPicture` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_senderId` int NOT NULL,
  `fk_receiverId` int NOT NULL,
  `title` text DEFAULT NULL,
  `message` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_senderId` (`fk_senderId`),
  KEY `fk_receiverId` (`fk_receiverId`),
  CONSTRAINT `message_ibfk_1` FOREIGN KEY (`fk_senderId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `message_ibfk_2` FOREIGN KEY (`fk_receiverId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES (1,1,2,'I found some thing you know','Lolllll ?? Chinese ','2023-01-20 11:30:10');
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `concactMessage`
--

DROP TABLE IF EXISTS `concactMessage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `concactMessage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_messageId` int NOT NULL,
  `isFound` int NOT NULL,
  `isPhoneNoShared` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `fk_messageId` (`fk_messageId`),
  CONSTRAINT `concactMessage_ibfk_1` FOREIGN KEY (`fk_messageId`) REFERENCES `message` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `concactMessage`
--

LOCK TABLES `concactMessage` WRITE;
/*!40000 ALTER TABLE `concactMessage` DISABLE KEYS */;
INSERT INTO `concactMessage` VALUES (1,1,0,1);
/*!40000 ALTER TABLE `concactMessage` ENABLE KEYS */;
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
