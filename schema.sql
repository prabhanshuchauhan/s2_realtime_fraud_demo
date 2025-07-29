-- Users table: stores user profiles and home locations
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(64),
  `home_lat` double NOT NULL,
  `home_lon` double NOT NULL,
  `city` varchar(100),
  `country` varchar(100),
  PRIMARY KEY (`user_id`)
);

-- Transactions table: stores all ATM transactions
CREATE TABLE `transactions` (
  `tx_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `ts` datetime NOT NULL,
  `lat` double NOT NULL,
  `lon` double NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `atm_id` varchar(64),
  PRIMARY KEY (`tx_id`)
);

-- Potential fraud table: stores detected suspicious transaction pairs
CREATE TABLE `potential_fraud` (
  `fraud_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `tx_id1` bigint(20) DEFAULT NULL,
  `tx_id2` bigint(20) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `distance_km` double DEFAULT NULL,
  `secs` int(11) DEFAULT NULL,
  `speed_kmh` double DEFAULT NULL,
  `flagged_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fraud_id`)
);

-- Metadata table: tracks last processed timestamp for scheduled jobs
CREATE TABLE `fraud_metadata` (
  `id` int(11) NOT NULL,
  `last_processed_ts` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- Initialize fraud_metadata with default value
INSERT INTO fraud_metadata (id, last_processed_ts) VALUES (1, '1970-01-01 00:00:00')
ON DUPLICATE KEY UPDATE last_processed_ts = last_processed_ts;

-- Backup procedure for ingesting transactions (used by pipeline)
DELIMITER //
CREATE OR REPLACE PROCEDURE fraud_proc(
    batch QUERY(user_id INT, timestamp TEXT, lat DOUBLE, lon DOUBLE, amount DOUBLE, atm_id VARCHAR(64))
)
AS
BEGIN
    INSERT INTO transactions(user_id, ts, lat, lon, amount, atm_id)
    SELECT
        user_id,
        LEFT(SUBSTRING_INDEX(timestamp, '+', 1), 19), -- trims microseconds and timezone
        lat,
        lon,
        amount,
        atm_id
    FROM batch;
END//
DELIMITER ;

-- Pipeline: loads user data from Kafka topic into users table
CREATE PIPELINE `fraud_demo_users`
AS LOAD DATA KAFKA '<your_kafka_broker>/atm-users'
BATCH_INTERVAL 1000
DISABLE OFFSETS METADATA GC
INTO TABLE `users`
FORMAT JSON
(
    `users`.`user_id` <- `user_id`,
    `users`.`username` <- `username`,
    `users`.`home_lat` <- `home_lat`,
    `users`.`home_lon` <- `home_lon`,
    `users`.`city` <- `city`,
    `users`.`country` <- `country`
)
ON DUPLICATE KEY UPDATE
    `username` = VALUES(`users`.`username`),
    `home_lat` = VALUES(`users`.`home_lat`),
    `home_lon` = VALUES(`users`.`home_lon`),
    `city` = VALUES(`users`.`city`),
    `country` = VALUES(`users`.`country`);

TEST PIPELINE fraud_demo_users LIMIT 5;

START PIPELINE fraud_demo_users;

-- Pipeline: loads transaction data from Kafka topic into transactions table via procedure
CREATE PIPELINE `fraud_demo_transactions`
AS LOAD DATA KAFKA '<your_kafka_broker>:9092/atm-transactions'
BATCH_INTERVAL 1000
DISABLE OFFSETS METADATA GC
INTO PROCEDURE `fraud_proc`
FORMAT JSON
(
    `user_id` <- `user_id`,
    `timestamp` <- `timestamp`,
    `lat` <- `lat`,
    `lon` <- `lon`,
    `amount` <- `amount`,
    `atm_id` <- `atm_id`
);

TEST PIPELINE fraud_demo_transactions LIMIT 5;

START PIPELINE fraud_demo_transactions;


