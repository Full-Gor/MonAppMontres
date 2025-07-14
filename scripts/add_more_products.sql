-- Ajouter des produits dans les catégories manquantes
-- Note: Les IDs seront auto-générés par la séquence SERIAL

-- Produits Vintage
INSERT INTO products (name, price, image, category, mechanism, material, waterResistance) VALUES
('Heritage 1960', 3899, 'https://images.pexels.com/photos/9979107/pexels-photo-9979107.jpeg', 'vintage', 'Manuel', 'Or jaune', '30m'),
('Rétro Classic', 2799, 'https://images.pexels.com/photos/9980871/pexels-photo-9980871.jpeg', 'vintage', 'Automatique', 'Acier vieilli', '50m'),
('Nostalgie', 3299, 'https://images.pexels.com/photos/9979776/pexels-photo-9979776.jpeg', 'vintage', 'Manuel', 'Laiton', '30m'),
('Époque Dorée', 4199, 'https://images.pexels.com/photos/9980300/pexels-photo-9980300.jpeg', 'vintage', 'Automatique', 'Or rose', '30m'),
('Collector 1970', 5499, 'https://images.pexels.com/photos/9978818/pexels-photo-9978818.jpeg', 'vintage', 'Manuel', 'Platine', '50m'),
('Vintage Master', 3599, 'https://images.pexels.com/photos/9979673/pexels-photo-9979673.jpeg', 'vintage', 'Automatique', 'Acier', '100m');

-- Produits Femme
INSERT INTO products (name, price, image, category, mechanism, material, waterResistance) VALUES
('Élégance Féminine', 2299, 'https://images.pexels.com/photos/9980088/pexels-photo-9980088.jpeg', 'femme', 'Automatique', 'Or rose', '50m'),
('Diamant Rose', 3999, 'https://images.pexels.com/photos/9978735/pexels-photo-9978735.jpeg', 'femme', 'Quartz', 'Or blanc', '30m'),
('Perle Nacrée', 2799, 'https://images.pexels.com/photos/9979545/pexels-photo-9979545.jpeg', 'femme', 'Automatique', 'Nacre', '50m'),
('Saphir Bleu', 4599, 'https://images.pexels.com/photos/9980262/pexels-photo-9980262.jpeg', 'femme', 'Manuel', 'Platine', '30m'),
('Délicate', 1999, 'https://images.pexels.com/photos/9979892/pexels-photo-9979892.jpeg', 'femme', 'Quartz', 'Acier', '100m'),
('Grâce Éternelle', 3299, 'https://images.pexels.com/photos/9978869/pexels-photo-9978869.jpeg', 'femme', 'Automatique', 'Or rose', '50m');

-- Produits Édition Limitée
INSERT INTO products (name, price, image, category, mechanism, material, waterResistance) VALUES
('Skeleton X', 8999, 'https://images.pexels.com/photos/9980432/pexels-photo-9980432.jpeg', 'édition limitée', 'Tourbillon', 'Titane', '200m'),
('Lunar Phase', 12999, 'https://images.pexels.com/photos/9979231/pexels-photo-9979231.jpeg', 'édition limitée', 'Perpétuel', 'Or blanc', '50m'),
('Carbon Fiber', 7499, 'https://images.pexels.com/photos/9978952/pexels-photo-9978952.jpeg', 'édition limitée', 'Automatique', 'Carbone', '300m'),
('Anniversary 100', 15999, 'https://images.pexels.com/photos/9980567/pexels-photo-9980567.jpeg', 'édition limitée', 'Grande Complication', 'Platine', '30m'),
('Limited Black', 6999, 'https://images.pexels.com/photos/9979456/pexels-photo-9979456.jpeg', 'édition limitée', 'Automatique', 'Céramique', '200m'),
('Exclusive Gold', 19999, 'https://images.pexels.com/photos/9978642/pexels-photo-9978642.jpeg', 'édition limitée', 'Tourbillon', 'Or massif', '50m'); 