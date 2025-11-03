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
