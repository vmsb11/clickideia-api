-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 05-Dez-2022 às 15:32
-- Versão do servidor: 10.4.14-MariaDB
-- versão do PHP: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `clickideia-vini`
--
CREATE DATABASE IF NOT EXISTS `clickideia-vini` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `clickideia-vini`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `cards`
--

DROP TABLE IF EXISTS `cards`;
CREATE TABLE IF NOT EXISTS `cards` (
  `cardId` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` int(10) UNSIGNED NOT NULL,
  `title` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 NOT NULL,
  `status` varchar(30) CHARACTER SET utf8mb4 NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`cardId`),
  KEY `FK_USER_CARD` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `cards`
--

INSERT INTO `cards` (`cardId`, `userId`, `title`, `content`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 86, 'Click Ideia 123', 'fhsdfhjdshfksdfhdskfhsdkfhsdkfsdfhsdfhjdshfksdfhdskfhsdkfhsdkfsdfhsdfhjdshfksdfhdskfhsdkfhsdkfsdfhsdfhjdshfksdfhdskfhsdkfhsdkfsdfhsdfhjdshfksdfhdskfhsdkfhsdkfsdfhsdfhjdshfksdfhdskfhsdkfhsdkfsdfhsdfhjdshfksdfhdskfhsdkfhsdkfsdfhsdfhjdshfksdfhdskfhsdkfhsdkfsdfhsdfhjdshfksdfhdskfhsdkfhsdkfsdfhsdfhjdshfksdfhdskfhsdkfhsdkfsdfhsdfhjdshfksdfhdskfhsdkfhs', 'TO-DO', '2022-11-30 16:06:44', '2022-12-04 00:25:22'),
(2, 86, 'Task 2', 'fhsdfhjdshfksdfhdskfhsdkfhsdkfsd', 'DOING', '2022-11-30 16:07:01', '2022-12-04 13:40:51'),
(3, 86, 'Task 522', 'Tarefa22222', 'DONE', '2022-11-30 16:07:11', '2022-12-04 13:40:48'),
(4, 86, 'Task 5', 'fhsdfhjdshfksdfhdskfhsdkfhsdkfsd', 'DOING', '2022-11-30 16:08:26', '2022-12-03 22:29:30'),
(6, 86, 'Task 5666', 'fhsdfhjdshfksdfhdskfhsdkfhsdkfsd', 'DONE', '2022-11-30 16:12:09', '2022-12-03 15:57:07'),
(11, 86, 'dsds', 'dsdsds', 'DONE', '2022-12-03 00:49:53', '2022-12-03 22:29:19'),
(12, 86, 'dsfsdfsd', 'fsdfsdfsd', 'TO-DO', '2022-12-03 01:11:40', '2022-12-03 01:11:40'),
(14, 86, 'dsd', 'sdsds', 'DOING', '2022-12-03 01:12:46', '2022-12-04 01:22:04'),
(15, 86, 'Card 3', 'fdfdfd', 'TO-DO', '2022-12-03 01:43:39', '2022-12-03 15:27:11'),
(16, 86, 'Teste', 'dfdfdfd', 'DONE', '2022-12-03 15:27:24', '2022-12-03 15:27:24'),
(18, 86, 'Task 236762', 'dfdfd', 'DONE', '2022-10-30 17:00:00', '2022-10-30 17:00:00'),
(19, 100, 'Card 1', 'dfdfdfdfd', 'TO-DO', '2022-12-05 10:11:22', '2022-12-05 10:27:25'),
(20, 100, 'Card 2', 'sfsdsds', 'DOING', '2022-12-05 10:14:57', '2022-12-05 10:28:08');

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `userId` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `mail` varchar(50) NOT NULL,
  `login` varchar(16) NOT NULL,
  `password` varchar(16) NOT NULL,
  `status` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `mail` (`mail`),
  UNIQUE KEY `userId` (`userId`),
  UNIQUE KEY `login` (`login`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `users`
--

INSERT INTO `users` (`userId`, `name`, `mail`, `login`, `password`, `status`, `createdAt`, `updatedAt`) VALUES
(86, 'Vinícius Moreira da Silva Braga', 'vmsb11@yahoo.com.br', 'vmsb11', '123456', 'Ativo', '2022-11-30 15:17:56', '2022-12-04 11:15:33'),
(92, 'Click Ideia', 'vmsb11@gmail.com', 'clickideia', '123456', 'Ativo', '2022-11-30 16:05:27', '2022-11-30 16:05:27'),
(100, 'Eliane', 'vmsb111@gmail.com', 'vmsb111', '123456', 'Ativo', '2022-12-05 10:11:03', '2022-12-05 10:11:03');

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `cards`
--
ALTER TABLE `cards`
  ADD CONSTRAINT `FK_USER_CARD` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
