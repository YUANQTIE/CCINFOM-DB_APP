DROP SCHEMA IF EXISTS carnivault;

CREATE SCHEMA IF NOT EXISTS carnivault;
USE carnivault;

CREATE TABLE IF NOT EXISTS `supplier`(
    `supplier_id` VARCHAR(30) NOT NULL,
	`company_name` VARCHAR(50) NOT NULL,
    `contact_no` VARCHAR(20) NOT NULL,
    PRIMARY KEY(`supplier_id`)
);

CREATE TABLE IF NOT EXISTS `livestock` (
    `livestock_id` VARCHAR(20) NOT NULL,
    `breed` VARCHAR(50) NOT NULL,
    `weight` DECIMAL(6,2) NOT NULL,
    `age` INT NOT NULL,
    `country_of_origin` VARCHAR(50) NOT NULL,
    `medical_condition` VARCHAR(100) NOT NULL,
    `vaccination_status` ENUM('Vaccinated', 'Not Vaccinated', 'Pending') NOT NULL,
    `date_arrived` DATE NOT NULL,
    `storage_location` VARCHAR(50) NOT NULL,
    `supplier_id` VARCHAR(30) NOT NULL,
    `status` ENUM('For Processing', 'Processed', 'Discarded') NOT NULL,
	`processing_date` DATE DEFAULT NULL,
    PRIMARY KEY (`livestock_id`),
    CONSTRAINT FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`supplier_id`)
);

CREATE TABLE IF NOT EXISTS `meat_selection` (
	`serial_no` VARCHAR(30) NOT NULL,
	`cut_type` ENUM(
    'Arm Chuck Roast', 'Cross Rib Chuck Roast', 'Prime Rib Roast', 'Porterhouse Steak', 'Top Sirloin Steak',
    'Top Round', 'Kabobs', 'Arm Chuck Steak', 'Shoulder Roast', 'Ribeye Steak, Bone-In', 'T-Bone Steak',
    'Top Sirloin Petite Roast', 'Top Round Steak', 'Stew Meat', 'Blade Chuck Roast', 'Shoulder Steak', 'Back Ribs',
    'Strip Steak, Bone-In', 'Top Sirloin Filet', 'Bottom Round Roast', 'Strips', 'Blade Chuck Steak', 'Ranch Steak',
	'Ribeye Roast, Boneless', 'Strip Steak, Boneless', 'Coulotte Roast', 'Bottom Round Rump Roast', 'Cubed Steak',
    '7-Bone Chuck Roast', 'Flat Iron Steak', 'Ribeye Steak, Boneless', 'Strip Petite Roast', 'Coulotte Steak',
    'Ground Beef and Ground Beef Patties', 'Chuck Center Roast', 'Top Blade Steak', 'Ribeye Cap Steak', 'Strip Filet', 
    'Tri-Tip Roast', 'Eye of Round Roast', 'Shank Cross-Cut', 'Denver Steak', 'Shoulder Petite Tender', 'Ribeye Petite Roast',
    'Tenderloin Roast', 'Tri-Tip Steak', 'Eye of Round Steak', 'Tenderloin Tips', 'Chuck Eye Roast', 'Shoulder Petite Tender Medallions',
    'Ribeye Filet', 'Tenderloin Steak (Filet Mignon)', 'Petite Sirloin Steak', 'Brisket Flat', 'Inside Skirt', 'Flank Steak',
    'Short Ribs, Bone-In', 'Chuck Eye Steak', 'Sirloin Bavette Steak', 'Brisket Point', 'Country-Style Ribs'
	) NOT NULL,
	`weight` DECIMAL(6,2) NOT NULL,
	`expiry_date` DATE NOT NULL,
	`storage_location` VARCHAR(50) NOT NULL,
	`quality_control_clearance` ENUM('Pending','Approved','Rejected') NOT NULL,
	`status` ENUM('Available','Reserved','Sold','Discarded') NOT NULL,
	`origin_livestock_id` VARCHAR(20) NOT NULL,
    PRIMARY KEY (`serial_no`),
    CONSTRAINT FOREIGN KEY (`origin_livestock_id`) REFERENCES `livestock`(`livestock_id`)
);

CREATE TABLE IF NOT EXISTS `nutrition` (
	`item_serial_no` VARCHAR(30) PRIMARY KEY NOT NULL,
    `tenderness` ENUM('Very Tender','Tender','Moderate','Tough') NOT NULL,
	`color` ENUM('Bright Red','Dark Red','Pale','Brownish') NOT NULL,
	`fat_content` DECIMAL(5, 2) NOT NULL,
	`protein_content` DECIMAL(5, 2) NOT NULL,
	`connective_tissue_content` DECIMAL(5, 2) NOT NULL,
	`water_holding_capacity` DECIMAL(5, 2) NOT NULL,
	`pH` DECIMAL(5, 2) NOT NULL,
	`water_distribution` DECIMAL(5,2) NOT NULL,
    CONSTRAINT FOREIGN KEY (`item_serial_no`) REFERENCES `meat_selection`(`serial_no`)
);

CREATE TABLE IF NOT EXISTS `clients` (
  `restaurant_code` VARCHAR(8),
  `client_name` VARCHAR(100) NOT NULL,
  `restaurant_name` VARCHAR(100) NOT NULL,
  `restaurant_type` VARCHAR(50) NOT NULL,
  `restaurant_address` VARCHAR(150) NOT NULL,
  `contact_no` VARCHAR(20),
  `email_address` VARCHAR(100),
  `year_of_establishment` INT,
  PRIMARY KEY (`restaurant_code`)
);

CREATE TABLE IF NOT EXISTS `deliveries` (
    `delivery_no` INT AUTO_INCREMENT NOT NULL,
    `driver_name` VARCHAR(100) NOT NULL,
    `truck_number` VARCHAR(20) NOT NULL,
    `distance_traveled` DECIMAL(8,2) DEFAULT NULL,
    `delivery_duration` DECIMAL(5,2) DEFAULT NULL,
    `weight` DECIMAL(6,2) NOT NULL,
    `restaurant_code` VARCHAR(8),
    `status` ENUM('Pending', 'Delivered', 'Cancelled', 'Returned'),
    `profit` DECIMAL(10,2),
    PRIMARY KEY (`delivery_no`),
    CONSTRAINT FOREIGN KEY (`restaurant_code`) REFERENCES `clients`(`restaurant_code`)
);

CREATE TABLE IF NOT EXISTS `order_line`(
	`order_no` INT NOT NULL,
    `item_serial_no` VARCHAR(30) NOT NULL,
    PRIMARY KEY(`order_no`, `item_serial_no`),
    CONSTRAINT FOREIGN KEY(`item_serial_no`) REFERENCES `meat_selection`(`serial_no`),
    CONSTRAINT FOREIGN KEY(`order_no`) REFERENCES `deliveries`(`delivery_no`)
);

CREATE TABLE `agreements` (
  `restaurant_code` VARCHAR(8) NOT NULL,
  `contract_end` DATE NOT NULL,
  `contract_start` DATE NOT NULL,
  `client_pricing` DECIMAL(5,2) NOT NULL,
  `week_of_delivery` INT NOT NULL,
  `cut_type_of_choice` ENUM('Arm Chuck Roast','Cross Rib Chuck Roast','Prime Rib Roast','Porterhouse Steak','Top Sirloin Steak','Top Round','Kabobs','Arm Chuck Steak','Shoulder Roast','Ribeye Steak, Bone-In','T-Bone Steak','Top Sirloin Petite Roast','Top Round Steak','Stew Meat','Blade Chuck Roast','Shoulder Steak','Back Ribs','Strip Steak, Bone-In','Top Sirloin Filet','Bottom Round Roast','Strips','Blade Chuck Steak','Ranch Steak','Ribeye Roast, Boneless','Strip Steak, Boneless','Coulotte Roast','Bottom Round Rump Roast','Cubed Steak','7-Bone Chuck Roast','Flat Iron Steak','Ribeye Steak, Boneless','Strip Petite Roast','Coulotte Steak','Ground Beef and Ground Beef Patties','Chuck Center Roast','Top Blade Steak','Ribeye Cap Steak','Strip Filet','Tri-Tip Roast','Eye of Round Roast','Shank Cross-Cut','Denver Steak','Shoulder Petite Tender','Ribeye Petite Roast','Tenderloin Roast','Tri-Tip Steak','Eye of Round Steak','Tenderloin Tips','Chuck Eye Roast','Shoulder Petite Tender Medallions','Ribeye Filet','Tenderloin Steak (Filet Mignon)','Petite Sirloin Steak','Brisket Flat','Inside Skirt','Flank Steak','Short Ribs, Bone-In','Chuck Eye Steak','Sirloin Bavette Steak','Brisket Point','Country-Style Ribs') NOT NULL,
  `tenderness` ENUM('Very Tender','Tender','Moderate','Tough') DEFAULT NULL,
  `color` ENUM('Bright Red','Dark Red','Pale','Brownish') DEFAULT NULL,
  `fat_content` DECIMAL(5,2) DEFAULT NULL,
  `protein_content` DECIMAL(5,2) DEFAULT NULL,
  `connective_tissue_content` DECIMAL(5,2) DEFAULT NULL,
  `water_holding_capacity` DECIMAL(5,2) DEFAULT NULL,
  `pH` DECIMAL(5,2) DEFAULT NULL,
  `water_distribution` DECIMAL(5,2) DEFAULT NULL,
  CONSTRAINT FOREIGN KEY (`restaurant_code`) REFERENCES `clients` (`restaurant_code`)
)