CREATE TABLE `credential` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `application_name` varchar(100) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `client_id` varchar(100) NOT NULL,
  `client_secret` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `credential_unique_app_clientid` (`application_name`,`client_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
