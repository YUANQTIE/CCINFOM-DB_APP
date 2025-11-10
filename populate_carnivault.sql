USE carnivault;

SELECT * FROM supplier;

INSERT INTO supplier (supplier_id, company_name, contact_no)
VALUES ('XYZ001', 'XYZ Company', '09183752750'),
('CHW001', 'Beef Chop Company', '09387541928'),
('FRM002', 'Fresh Farms Supply', '09214567890'),
('MTK003', 'MeatKing Traders', '09091234567'),
('GDS004', 'Golden Deli Suppliers', '09175678901'),
('PFC005', 'Prime Food Corp', '09289876543'),
('NTS006', 'Northstar Trading', '09361234598'),
('SLV007', 'Silverline Meats', '09193456782'),
('BRV008', 'Bravo Food Products', '09084561239');

DELETE FROM livestock WHERE livestock_id = '251023-0001';

SELECT * FROM livestock;
INSERT INTO livestock(livestock_id, breed, weight, age, country_of_origin, medical_condition, vaccination_status, date_arrived, storage_location, supplier_id, status, processing_date)
VALUES 
('251023-0002', 'Angus Cattle', 1120, 6, 'Australia', 'Healthy', 1, '2025-10-23', 'Farm 2', 'CHW001', 2, '2025-10-25'),
('251021-0003', 'Brahman Cattle', 1045, 4, 'Brazil', 'Healthy', 1, '2025-10-21', 'Farm 3', 'FRM002', 2, '2025-10-22'),
('251019-0004', 'Charolais Cattle', 1380, 7, 'France', 'Healthy', 1, '2025-10-19', 'Farm 4', 'MTK003', 2, '2025-10-21'),
('251018-0005', 'Limousin Cattle', 1265, 5, 'Ireland', 'Healthy', 1, '2025-10-18', 'Farm 5', 'GDS004', 2, '2025-10-20'),
('251017-0006', 'Simmental Cattle', 1189, 8, 'Germany', 'Healthy', 1, '2025-10-17', 'Farm 1', 'PFC005', 2, '2025-10-18'),
('251016-0007', 'Shorthorn Cattle', 975, 3, 'United Kingdom', 'Healthy', 1, '2025-10-16', 'Farm 2', 'NTS006', 2, '2025-10-17'),
('251014-0008', 'Highland Cattle', 1104, 9, 'Scotland', 'Healthy', 1, '2025-10-14', 'Farm 3', 'SLV007', 2, '2025-10-16'),
('251012-0009', 'Beefmaster Cattle', 1430, 10, 'Mexico', 'Healthy', 1, '2025-10-12', 'Farm 4', 'BRV008', 2, '2025-10-14'),
('251010-0010', 'Gelbvieh Cattle', 1308, 6, 'Canada', 'Healthy', 1, '2025-10-10', 'Farm 5', 'XYZ001', 2, '2025-10-12');

SELECT * FROM meat_selection;
INSERT INTO meat_selection (serial_no, cut_type, weight, expiry_date, storage_location, quality_control_clearance, status, origin_livestock_id)
VALUES
('ACR823451', 'Arm Chuck Roast', 5.20, '2026-03-15', 'Cooler 3', 'Approved', 'Available', '251023-0002'),
('PRS932817', 'Prime Rib Roast', 7.85, '2026-05-10', 'Cooler 5', 'Approved', 'Available', '251019-0004'),
('TBS128640', 'T-Bone Steak', 0.68, '2026-04-22', 'Cooler 2', 'Approved', 'Available', '251012-0009'),
('RBS452918', 'Ribeye Steak, Boneless', 0.75, '2026-06-05', 'Cooler 7', 'Approved', 'Available', '251018-0005'),
('BCR761502', 'Blade Chuck Roast', 4.90, '2026-02-20', 'Cooler 6', 'Approved', 'Available', '251021-0003'),
('SRS187349', 'Sirloin Bavette Steak', 1.10, '2026-03-09', 'Cooler 4', 'Approved', 'Available', '251014-0008'),
('BFR316802', 'Brisket Flat', 6.75, '2026-05-30', 'Cooler 8', 'Approved', 'Available', '251017-0006'),
('FRS209864', 'Flank Steak', 1.35, '2026-04-18', 'Cooler 9', 'Approved', 'Available', '251016-0007'),
('TRS592740', 'Tri-Tip Roast', 2.80, '2026-06-12', 'Cooler 10', 'Approved', 'Available', '251010-0010'),
('CBS874612', 'Chuck Eye Steak', 0.85, '2026-01-28', 'Cooler 1', 'Approved', 'Available', '251018-0005');

SELECT * FROM meat_selection
WHERE status = 'Sold';
INSERT INTO meat_selection (serial_no, cut_type, weight, expiry_date, storage_location, quality_control_clearance, status, origin_livestock_id)
VALUES
('CSR345781', 'Chuck Center Roast', 4.60, '2026-05-20', 'Cooler 2', 'Approved', 'Sold', '251018-0005'),
('SSR219084', 'Shoulder Roast', 5.10, '2026-06-10', 'Cooler 4', 'Approved', 'Sold', '251021-0003'),
('RPR817294', 'Ribeye Roast, Boneless', 6.85, '2026-04-15', 'Cooler 6', 'Approved', 'Sold', '251016-0007'),
('TRT678520', 'Tri-Tip Steak', 1.25, '2026-03-22', 'Cooler 8', 'Approved', 'Sold', '251014-0008'),
('BRS904731', 'Bottom Round Roast', 4.90, '2026-05-28', 'Cooler 9', 'Approved', 'Sold', '251010-0010');

SELECT * FROM nutrition;
INSERT INTO nutrition (item_serial_no, tenderness, color, fat_content, protein_content, connective_tissue_content, water_holding_capacity, pH, water_distribution)
VALUES
('TRS592740', 'Tender', 'Bright Red', 8.50, 21.30, 2.10, 75.20, 5.60, 74.80),
('TBS128640', 'Very Tender', 'Bright Red', 6.80, 22.10, 1.80, 77.00, 5.55, 76.50),
('SRS187349', 'Moderate', 'Dark Red', 9.40, 20.50, 3.20, 73.80, 5.70, 73.10),
('FRS209864', 'Tender', 'Bright Red', 7.10, 23.00, 2.00, 76.40, 5.50, 75.90),
('BFR316802', 'Tough', 'Dark Red', 12.30, 19.80, 4.10, 71.50, 5.85, 70.20),
('CBS874612', 'Tender', 'Bright Red', 5.90, 24.10, 1.60, 78.30, 5.45, 77.90),
('RBS452918', 'Very Tender', 'Bright Red', 7.40, 23.50, 1.90, 77.60, 5.50, 76.70),
('PRS932817', 'Tender', 'Bright Red', 10.20, 21.70, 2.50, 74.50, 5.65, 73.80),
('BCR761502', 'Moderate', 'Dark Red', 11.00, 20.80, 3.90, 72.80, 5.75, 72.10),
('ACR823451', 'Tender', 'Bright Red', 9.00, 22.40, 2.30, 75.90, 5.60, 75.20);

INSERT INTO nutrition (item_serial_no,tenderness,color,fat_content,protein_content,connective_tissue_content,water_holding_capacity,pH,water_distribution)
VALUES
('BRS904731', 'Tender', 'Bright Red', 18.20, 21.50, 2.30, 75.40, 5.65, 72.10),
('CSR345781', 'Moderate', 'Dark Red', 12.70, 22.10, 3.10, 73.80, 5.70, 70.50),
('RPR817294', 'Very Tender', 'Bright Red', 20.90, 20.80, 1.80, 76.20, 5.55, 74.90),
('SSR219084', 'Tender', 'Pale', 15.60, 23.40, 2.00, 74.10, 5.75, 71.60),
('TRT678520', 'Tough', 'Brownish', 10.40, 24.10, 3.60, 72.90, 5.85, 69.80);


SELECT * FROM clients;
INSERT INTO clients (restaurant_code, client_name, restaurant_name, restaurant_type, restaurant_address, contact_no, email_address, year_of_establishment)
VALUES
('BBQ-101', 'Carlos Mendoza', 'Smokey Ribs Grill', 'Barbecue Restaurant', '123 Katipunan Ave, Quezon City, Metro Manila', '09182347651', 'c.mendoza@smokeyribs.ph', 2012),
('STK-202', 'Andrea Santos', 'Prime Cuts Steakhouse', 'Steakhouse', '45 Jupiter St, Makati City, Metro Manila', '09081239567', 'andrea.santos@primecuts.ph', 2015),
('BRG-303', 'Miguel Reyes', 'Burger Republic', 'Burger Joint', '88 Taft Ave, Malate, Manila, Metro Manila', '09361247890', 'miguel.reyes@burgerrepublic.ph', 2018),
('BYR-404', 'Lara Villanueva', 'The Butcher’s Yard', 'Meat Deli & Grill', '56 E. Rodriguez Sr. Ave, Quezon City, Metro Manila', '09284563712', 'lara.v@butchersyard.ph', 2010),
('GRL-505', 'Patrick Lim', 'Grill Avenue', 'Casual Dining', '678 Shaw Blvd, Mandaluyong City, Metro Manila', '09193456218', 'patrick.lim@grillavenue.ph', 2016),
('BST-606', 'Joanna Cruz', 'Beef Street Tavern', 'Gastro Pub', '12 P. Burgos St, Makati City, Metro Manila', '09276451832', 'joanna.cruz@beefstreet.ph', 2014),
('HUS-707', 'Daniel Tan', 'House of Steaks', 'Steakhouse', '24 Timog Ave, Quezon City, Metro Manila', '09352349870', 'daniel.tan@houseofsteaks.ph', 2008),
('MTL-808', 'Grace Dela Cruz', 'MeatLab Kitchen', 'Modern Bistro', '39 Pioneer St, Mandaluyong City, Metro Manila', '09094567823', 'grace.dc@meatlab.ph', 2019),
('CRV-909', 'Joseph Bautista', 'Carnivore’s Table', 'Fine Dining', '72 Greenhills Ave, San Juan City, Metro Manila', '09175678934', 'joseph.bautista@carnivorestable.ph', 2011),
('BFS-010', 'Rica Navarro', 'Beef & Fire Smokehouse', 'Barbecue Restaurant', '95 Macapagal Blvd, Pasay City, Metro Manila', '09381245679', 'rica.navarro@beeffire.ph', 2017);

SELECT * FROM deliveries;
INSERT INTO deliveries (driver_name,truck_number,deliver_date,distance_traveled,delivery_duration,weight,restaurant_code,status,profit)
VALUES
('Mario Dela Cruz', 1024, '2025-11-05', 12.50, 45.00, 16.35, 'BBQ-101', 'Delivered', 2850.00),
('Ramon Villanueva', 2089, '2025-11-07', 8.75, 30.00, 6.35, 'STK-202', 'Delivered', 1190.00);

SELECT * FROM order_line;
INSERT INTO order_line (order_no, item_serial_no)
VALUES
(3, 'BRS904731'),
(3, 'CSR345781'),
(3, 'RPR817294'),
(4, 'SSR219084'),
(4, 'TRT678520');