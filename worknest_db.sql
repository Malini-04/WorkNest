-- WorkNest combined database dump
-- Merged from individual table exports on 2026-10-01

SET FOREIGN_KEY_CHECKS=0;
SET NAMES utf8mb4;

-- ---------------------------
-- Table: bookings_amenity
-- ---------------------------
DROP TABLE IF EXISTS `bookings_amenity`;
CREATE TABLE `bookings_amenity` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `bookings_amenity` VALUES (3,'LED/Smart TV Display'),(2,'Projector'),(5,'Video Conferencing System'),(4,'Whiteboard'),(1,'Wifi');

-- ---------------------------
-- Table: auth_user
-- ---------------------------
DROP TABLE IF EXISTS `auth_user`;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$600000$eJ3pk78vnyvxDhX8TModDQ$Pj02HFxSYo7djd6U/avn5kQhUziSJ0xuDb8eYOunNjs=','2026-09-30 16:35:27.158609',1,'Malini','','','',1,1,'2026-09-30 16:01:33.566187');

-- ---------------------------
-- Table: bookings_room
-- ---------------------------
DROP TABLE IF EXISTS `bookings_room`;
CREATE TABLE `bookings_room` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `capacity` int unsigned NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `bookings_room_chk_1` CHECK ((`capacity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `bookings_room` VALUES (1,'Nest 01',4,'room_images/4_RiXUSsb.jpg'),(2,'Nest 02',6,'room_images/6_IAPbedJ.webp'),(3,'Nest 03',8,'room_images/8_8Dt9XYi.webp'),(4,'Nest 04',10,'room_images/10_HMCjOgk.jpg'),(5,'Nest 05',12,'room_images/12_9Rz5Vsp.webp'),(6,'Nest 06',18,'room_images/18_MvZi8wH.webp');

-- ---------------------------
-- Table: django_content_type
-- ---------------------------
DROP TABLE IF EXISTS `django_content_type`;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(7,'bookings','amenity'),(9,'bookings','booking'),(8,'bookings','room'),(5,'contenttypes','contenttype'),(6,'sessions','session');

-- ---------------------------
-- Table: auth_permission
-- ---------------------------
DROP TABLE IF EXISTS `auth_permission`;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add amenity',7,'add_amenity'),(26,'Can change amenity',7,'change_amenity'),(27,'Can delete amenity',7,'delete_amenity'),(28,'Can view amenity',7,'view_amenity'),(29,'Can add room',8,'add_room'),(30,'Can change room',8,'change_room'),(31,'Can delete room',8,'delete_room'),(32,'Can view room',8,'view_room'),(33,'Can add booking',9,'add_booking'),(34,'Can change booking',9,'change_booking'),(35,'Can delete booking',9,'delete_booking'),(36,'Can view booking',9,'view_booking');

-- ---------------------------
-- Table: auth_group
-- ---------------------------
DROP TABLE IF EXISTS `auth_group`;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------
-- Table: bookings_booking
-- ---------------------------
DROP TABLE IF EXISTS `bookings_booking`;
CREATE TABLE `bookings_booking` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `start_time` time(6) NOT NULL,
  `end_time` time(6) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `booked_by_id` int NOT NULL,
  `room_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bookings_booking_booked_by_id_bc075bad_fk_auth_user_id` (`booked_by_id`),
  KEY `bookings_booking_room_id_6f0fa517_fk_bookings_room_id` (`room_id`),
  CONSTRAINT `bookings_booking_booked_by_id_bc075bad_fk_auth_user_id` FOREIGN KEY (`booked_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `bookings_booking_room_id_6f0fa517_fk_bookings_room_id` FOREIGN KEY (`room_id`) REFERENCES `bookings_room` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `bookings_booking` VALUES (1,'2026-10-01','15:30:00.000000','18:30:00.000000','2026-10-01 08:25:14.386236',1,5);

-- ---------------------------
-- Table: auth_group_permissions
-- ---------------------------
DROP TABLE IF EXISTS `auth_group_permissions`;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------
-- Table: auth_user_groups
-- ---------------------------
DROP TABLE IF EXISTS `auth_user_groups`;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------
-- Table: auth_user_user_permissions
-- ---------------------------
DROP TABLE IF EXISTS `auth_user_user_permissions`;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------
-- Table: bookings_room_amenities
-- ---------------------------
DROP TABLE IF EXISTS `bookings_room_amenities`;
CREATE TABLE `bookings_room_amenities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `room_id` bigint NOT NULL,
  `amenity_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bookings_room_amenities_room_id_amenity_id_9cbe7560_uniq` (`room_id`,`amenity_id`),
  KEY `bookings_room_amenit_amenity_id_d02af19b_fk_bookings_` (`amenity_id`),
  CONSTRAINT `bookings_room_amenit_amenity_id_d02af19b_fk_bookings_` FOREIGN KEY (`amenity_id`) REFERENCES `bookings_amenity` (`id`),
  CONSTRAINT `bookings_room_amenities_room_id_fbed0fa1_fk_bookings_room_id` FOREIGN KEY (`room_id`) REFERENCES `bookings_room` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `bookings_room_amenities` VALUES (1,1,1),(2,1,2),(3,1,4),(4,2,1),(5,2,2),(6,2,3),(7,2,4),(8,3,1),(9,3,2),(10,3,4),(11,3,5),(12,4,1),(13,4,2),(14,4,4),(15,4,5),(16,5,1),(17,5,2),(18,5,3),(19,5,4),(20,5,5),(21,6,1),(22,6,2),(23,6,3),(24,6,4),(25,6,5);

-- ---------------------------
-- Table: django_admin_log
-- ---------------------------
DROP TABLE IF EXISTS `django_admin_log`;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `django_admin_log` VALUES (1,'2026-09-30 16:21:02.174131','1','Wifi',1,'[{\"added\": {}}]',7,1),(2,'2026-09-30 16:22:55.491909','2','Projector',1,'[{\"added\": {}}]',7,1),(3,'2026-09-30 16:23:14.257501','3','LED/Smart TV Display',1,'[{\"added\": {}}]',7,1),(4,'2026-09-30 16:23:31.034995','4','Whiteboard',1,'[{\"added\": {}}]',7,1),(5,'2026-09-30 16:24:29.423585','5','Video Conferencing System',1,'[{\"added\": {}}]',7,1),(6,'2026-09-30 16:31:38.156459','1','Nest 01',1,'[{\"added\": {}}]',8,1),(7,'2026-09-30 16:32:20.415881','2','Nest 02',1,'[{\"added\": {}}]',8,1),(8,'2026-09-30 16:33:13.754413','3','Nest 03',1,'[{\"added\": {}}]',8,1),(9,'2026-09-30 16:33:49.568017','4','Nest 04',1,'[{\"added\": {}}]',8,1),(10,'2026-09-30 16:34:10.302834','5','Nest 05',1,'[{\"added\": {}}]',8,1),(11,'2026-09-30 16:34:46.870910','6','Nest 06',1,'[{\"added\": {}}]',8,1),(12,'2026-09-30 16:34:57.350334','5','Nest 05',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',8,1);

-- ---------------------------
-- Table: django_session
-- ---------------------------
DROP TABLE IF EXISTS `django_session`;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `django_session` VALUES ('yopqp16leei9csj6mtewmhx9bzdfv88a','.eJxVjEEOwiAQRe_C2pChQ9sZl-49AwEGpGpoUtqV8e7apAvd_vfefynnt7W4raXFTaLOyqjT7xZ8fKS6A7n7ept1nOu6TEHvij5o09dZ0vNyuH8HxbfyrcdE1vhMBiUyYR-GxBKJEIXZB-gsACFICOOAOXMXsWMYLFAC7pHV-wPU6Tb3:1xBxHD:GQkdzXV9Qel_CW8HOpTynWBMvNpWW3Sq3nSxQs3YAfc','2026-10-14 16:35:27.168599');

-- ---------------------------
-- Table: django_migrations
-- ---------------------------
DROP TABLE IF EXISTS `django_migrations`;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2026-09-30 15:59:12.234620'),(2,'auth','0001_initial','2026-09-30 15:59:13.109705'),(3,'admin','0001_initial','2026-09-30 15:59:13.273705'),(4,'admin','0002_logentry_remove_auto_add','2026-09-30 15:59:13.282889'),(5,'admin','0003_logentry_add_action_flag_choices','2026-09-30 15:59:13.292771'),(6,'contenttypes','0002_remove_content_type_name','2026-09-30 15:59:13.407000'),(7,'auth','0002_alter_permission_name_max_length','2026-09-30 15:59:13.479426'),(8,'auth','0003_alter_user_email_max_length','2026-09-30 15:59:13.506924'),(9,'auth','0004_alter_user_username_opts','2026-09-30 15:59:13.519791'),(10,'auth','0005_alter_user_last_login_null','2026-09-30 15:59:13.609217'),(11,'auth','0006_require_contenttypes_0002','2026-09-30 15:59:13.613404'),(12,'auth','0007_alter_validators_add_error_messages','2026-09-30 15:59:13.624814'),(13,'auth','0008_alter_user_username_max_length','2026-09-30 15:59:13.713403'),(14,'auth','0009_alter_user_last_name_max_length','2026-09-30 15:59:13.810483'),(15,'auth','0010_alter_group_name_max_length','2026-09-30 15:59:13.843097'),(16,'auth','0011_update_proxy_permissions','2026-09-30 15:59:13.852518'),(17,'auth','0012_alter_user_first_name_max_length','2026-09-30 15:59:13.930284'),(18,'bookings','0001_initial','2026-09-30 15:59:14.404713'),(19,'sessions','0001_initial','2026-09-30 15:59:14.515598');

SET FOREIGN_KEY_CHECKS=1;
