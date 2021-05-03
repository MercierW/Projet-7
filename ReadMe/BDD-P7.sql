CREATE DATABASE  IF NOT EXISTS `test` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `test`;
-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: test
-- ------------------------------------------------------
-- Server version	8.0.22

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
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `userName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `like` int DEFAULT '0',
  `dislike` int DEFAULT '0',
  `imgURL` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId_idx` (`userId`),
  CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (19,7,'Nathalie','Bonjour à tous, je suis Nathalie la community manager de Goupomania. :)',5,0,NULL,'2021-03-31 18:08:19','2021-04-20 18:39:42'),(20,5,'Robert','Salut à tous et bienvenue sur le nouveau réseau social de Groupomania, je suis Robert votre admin chargé de la maintenance et de la modération du site. ;)',6,0,NULL,'2021-03-31 18:12:10','2021-04-20 19:08:26'),(21,8,'William','Salut à tous je suis nouveau ici, il est sympa ce site. ;)',5,0,NULL,'2021-03-31 18:31:35','2021-04-20 19:05:00'),(22,9,'Lucie','Hey, je m\'appelle Lucie je suis nouvelle ici !',5,0,NULL,'2021-04-02 20:37:54','2021-04-20 19:04:58'),(24,10,'Tristan','Salut à tous moi c\'est Tristan, je sens qu\'on va bien s\'amuser ici !',5,0,NULL,'2021-04-12 17:51:38','2021-04-20 19:08:22'),(25,11,'Bertrand','Salut à tous moi c\'est Bertrand, je vous partage un site qui a l\'air sympa vous en pensez quoi ? :) https://openclassrooms.com/fr/',4,0,NULL,'2021-04-20 18:41:55','2021-04-20 19:08:20');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `responses`
--

DROP TABLE IF EXISTS `responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `responses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `messageId` int NOT NULL,
  `userName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `imgURL` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `messageId_idx` (`messageId`),
  CONSTRAINT `messageId` FOREIGN KEY (`messageId`) REFERENCES `messages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `responses`
--

LOCK TABLES `responses` WRITE;
/*!40000 ALTER TABLE `responses` DISABLE KEYS */;
INSERT INTO `responses` VALUES (79,19,'Robert','Hey salut Nathalie et bienvenue sur le Mur de Groupomania ! ',NULL,'2021-03-31 18:10:41','2021-03-31 18:10:41'),(80,19,'William','Bienvenue !',NULL,'2021-03-31 18:29:48','2021-03-31 18:29:48'),(81,20,'William','Salut Robert, le site est super pour échanger ! ',NULL,'2021-03-31 18:30:34','2021-03-31 18:30:34'),(82,21,'Lucie',NULL,'http://localhost:5000/images/Emojione_1F44B.svg_.png1617395952425.png','2021-04-02 20:39:12','2021-04-02 20:39:12'),(83,19,'Lucie','Salut Nathalie et bienvenue !',NULL,'2021-04-02 20:40:15','2021-04-02 20:40:15'),(84,20,'Lucie','Super Robert !',NULL,'2021-04-02 20:58:31','2021-04-02 20:58:31'),(131,21,'Robert','Salut William et bienvenu. ;)',NULL,'2021-04-12 17:14:51','2021-04-12 17:14:51'),(132,22,'Robert','Bienvenue Lucie. :)',NULL,'2021-04-12 17:15:06','2021-04-12 17:15:06'),(133,24,'Bertrand','Salut Tristan et bienvenu !',NULL,'2021-04-20 18:40:00','2021-04-20 18:40:00'),(134,22,'Bertrand','Coucou Lucie !',NULL,'2021-04-20 18:40:11','2021-04-20 18:40:11'),(135,24,'Lucie','Coucou Tristan. :)',NULL,'2021-04-20 18:43:51','2021-04-20 18:43:51'),(137,25,'Lucie','Ah mais il est super ce site, c\'est ici que j\'ai appris à coder, je le recommande !',NULL,'2021-04-20 18:45:12','2021-04-20 18:45:12'),(138,25,'Tristan',NULL,'http://localhost:5000/images/1f44d.png1618944571604.png','2021-04-20 18:49:31','2021-04-20 18:49:31'),(140,20,'Nathalie','Coucou ! :)',NULL,'2021-04-20 19:05:20','2021-04-20 19:05:20'),(141,22,'Nathalie','Hey Lucie !',NULL,'2021-04-20 19:05:35','2021-04-20 19:05:35'),(142,24,'Nathalie','Hey Tristan !',NULL,'2021-04-20 19:05:52','2021-04-20 19:05:52'),(143,25,'Nathalie','J\'ai vu les qu\'il y\'a pas mal de formation, vous recommandez quoi pour une personne qui veut effectuer une reconversion ?',NULL,'2021-04-20 19:07:56','2021-04-20 19:07:56'),(144,24,'Robert','Salut et bienvenu parmi nous !',NULL,'2021-04-20 19:08:59','2021-04-20 19:08:59'),(145,25,'Robert','Ça dépend, ce que tu cherches. Personnellement j\'ai fait celle de développer web, elle est géniale. ;)  ',NULL,'2021-04-20 19:10:35','2021-04-20 19:10:35'),(146,25,'Lucie','D\'accord avec Robert en plus tu peux te la faire financer, donc c\'est tout bénef !',NULL,'2021-04-20 19:12:43','2021-04-20 19:12:43'),(147,25,'Nathalie','Ok ! Je vais me renseigner, merci pour les réponses ! :)',NULL,'2021-04-20 19:13:46','2021-04-20 19:13:46');
/*!40000 ALTER TABLE `responses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pictureProfilURL` text COLLATE utf8mb4_unicode_ci,
  `isAdmin` int DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (5,'Robert','robert78@hotmail.fr','$2b$10$DvihYWTjem6bcPGGSv9qZuem68zkkYvYhGUQ5jd1ISBTVwf9aq5Oe','http://localhost:5000/images/Moi1.jpg1613942792660.jpg',1,'2020-11-30 15:47:33','2021-02-21 21:26:32'),(7,'Nathalie','nathalie77090@hotmail.fr','$2b$10$bv.bXBMX8yV19Z6uRpJO1uSqb1RjM5qHC1AlkB9mnPY1.9m29FOD6','http://localhost:5000/images/femme-01.jpg1617213724654.jpg',0,'2021-03-26 23:06:30','2021-03-31 18:02:04'),(8,'William','william@hotmail.fr','$2b$10$DyvRp7pgHNK/l/dqMoy18uMxYkksCJ23Gxyi/pzTAUXy7k90o6uZW','http://localhost:5000/images/19pe-chemise-homme-aventure-naturel-rayures-coton-a-poche-2.jpg1617215360451.jpg',0,'2021-03-31 18:19:38','2021-03-31 18:29:20'),(9,'Lucie','lucie@hotmail.fr','$2b$10$pf3oz9CLMsvlJ6xNbVtgwu6huuYI5GgPCo9VXRHo0SD0tCwL0xCfe','http://localhost:5000/images/s-l300.jpg1617395819160.jpg',0,'2021-04-02 20:35:45','2021-04-02 20:36:59'),(10,'Tristan','tristan77@hotmail.fr','$2b$10$Nw7KF/KACmmFAMS/BJ6Ys.lFBZq3S3oor4cRi5NMS1qxhvUFBpp1u','http://localhost:5000/images/tristan.jpg1618249827420.jpg',0,'2021-04-12 17:17:32','2021-04-12 17:50:27'),(11,'Bertrand','bertrand@hotmail.fr','$2b$10$7qwCceD3DkfJjEr/8vWwQODlsN5AO4/ZirTHpxc28lfvfgtLO7o8.','http://localhost:5000/images/6225181-julian-bugier-se-devoile-decoiffe-et-ave-950x0-1.jpg1618943956850.jpg',0,'2021-04-20 18:32:44','2021-04-20 18:39:16'),(12,'Bertrand','bertrand@hotmail.fr','$2b$10$FzkY1reyLPOWL0lSixGfTOhf5FkljMm6973eEMXvAvCDV5sJ08Ot6','http://localhost:5000/images/unknow-profil.jpg',0,'2021-04-20 18:32:45','2021-04-20 18:32:45');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usersdisliked`
--

DROP TABLE IF EXISTS `usersdisliked`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usersdisliked` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usersDislikedId` int NOT NULL,
  `messagesDislikedId` int NOT NULL,
  `userName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usersDislikedId_idx` (`usersDislikedId`),
  KEY `messagesId_idx` (`messagesDislikedId`),
  CONSTRAINT `messagesDislikedId` FOREIGN KEY (`messagesDislikedId`) REFERENCES `messages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usersDislikedId` FOREIGN KEY (`usersDislikedId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersdisliked`
--

LOCK TABLES `usersdisliked` WRITE;
/*!40000 ALTER TABLE `usersdisliked` DISABLE KEYS */;
/*!40000 ALTER TABLE `usersdisliked` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usersliked`
--

DROP TABLE IF EXISTS `usersliked`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usersliked` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usersLikedId` int NOT NULL,
  `messagesLikedId` int NOT NULL,
  `userName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `messageId_idx` (`messagesLikedId`),
  KEY `userId_idx` (`usersLikedId`),
  CONSTRAINT `messagesLikedId` FOREIGN KEY (`messagesLikedId`) REFERENCES `messages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usersLikedId` FOREIGN KEY (`usersLikedId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=579 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersliked`
--

LOCK TABLES `usersliked` WRITE;
/*!40000 ALTER TABLE `usersliked` DISABLE KEYS */;
INSERT INTO `usersliked` VALUES (548,5,19,'Robert','2021-03-31 18:10:01','2021-03-31 18:10:01'),(550,8,19,'William','2021-03-31 18:20:14','2021-03-31 18:20:14'),(551,8,20,'William','2021-03-31 18:20:15','2021-03-31 18:20:15'),(552,9,19,'Lucie','2021-04-02 20:36:06','2021-04-02 20:36:06'),(553,9,21,'Lucie','2021-04-02 20:36:09','2021-04-02 20:36:09'),(554,9,20,'Lucie','2021-04-02 20:36:14','2021-04-02 20:36:14'),(555,5,22,'Robert','2021-04-12 17:15:09','2021-04-12 17:15:09'),(556,5,21,'Robert','2021-04-12 17:15:12','2021-04-12 17:15:12'),(557,10,22,'Tristan','2021-04-12 17:50:48','2021-04-12 17:50:48'),(558,10,21,'Tristan','2021-04-12 17:50:50','2021-04-12 17:50:50'),(559,10,20,'Tristan','2021-04-12 17:50:52','2021-04-12 17:50:52'),(560,10,19,'Tristan','2021-04-12 17:50:54','2021-04-12 17:50:54'),(561,11,24,'Bertrand','2021-04-20 18:39:34','2021-04-20 18:39:34'),(562,11,22,'Bertrand','2021-04-20 18:39:36','2021-04-20 18:39:36'),(563,11,21,'Bertrand','2021-04-20 18:39:39','2021-04-20 18:39:39'),(564,11,20,'Bertrand','2021-04-20 18:39:41','2021-04-20 18:39:41'),(565,11,19,'Bertrand','2021-04-20 18:39:42','2021-04-20 18:39:42'),(566,9,25,'Lucie','2021-04-20 18:43:28','2021-04-20 18:43:28'),(567,9,24,'Lucie','2021-04-20 18:43:31','2021-04-20 18:43:31'),(568,9,22,'Lucie','2021-04-20 18:43:32','2021-04-20 18:43:32'),(569,10,25,'Tristan','2021-04-20 18:48:04','2021-04-20 18:48:04'),(570,10,24,'Tristan','2021-04-20 18:48:06','2021-04-20 18:48:06'),(571,7,25,'Nathalie','2021-04-20 19:04:49','2021-04-20 19:04:49'),(572,7,24,'Nathalie','2021-04-20 19:04:52','2021-04-20 19:04:52'),(573,7,22,'Nathalie','2021-04-20 19:04:58','2021-04-20 19:04:58'),(574,7,21,'Nathalie','2021-04-20 19:05:00','2021-04-20 19:05:00'),(575,7,20,'Nathalie','2021-04-20 19:05:04','2021-04-20 19:05:04'),(576,5,25,'Robert','2021-04-20 19:08:20','2021-04-20 19:08:20'),(577,5,24,'Robert','2021-04-20 19:08:22','2021-04-20 19:08:22'),(578,5,20,'Robert','2021-04-20 19:08:26','2021-04-20 19:08:26');
/*!40000 ALTER TABLE `usersliked` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-03 11:37:32
