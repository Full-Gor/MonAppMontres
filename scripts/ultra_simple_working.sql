-- Script SQL ultra-simple qui fonctionne à 100%
-- Basé sur l'analyse exacte de votre application
-- Exécuter dans Supabase SQL Editor

-- 1. Supprimer les tables si elles existent
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Créer la table users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT UNIQUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer la table products (colonnes exactes utilisées dans l'app)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image TEXT,
    category TEXT NOT NULL,
    mechanism TEXT,
    material TEXT,
    waterResistance TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Créer la table favorites
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- 5. Créer la table messages
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Créer la table orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Activer RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 8. Politiques RLS simples
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own messages" ON messages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

-- 9. Insérer l'admin
INSERT INTO users (id, name, email, is_admin) VALUES 
('00000000-0000-0000-0000-000000000001', 'Admin', 'admin123@gmail.com', true);

-- 10. Insérer les produits (colonnes exactes)
INSERT INTO products (name, price, image, category, mechanism, material, waterResistance) VALUES 
-- Classique
('Révélation Classique', 2499, 'https://videos.pexels.com/video-files/6827301/6827301-uhd_2560_1440_25fps.mp4', 'classique', 'Automatique', 'Acier inoxydable', '50m'),
('Tradition Éternelle', 3299, 'https://videos.pexels.com/video-files/856199/856199-hd_1920_1080_25fps.mp4', 'classique', 'Manuel', 'Or rose', '30m'),
('Héritage Noble', 2799, 'https://images.pexels.com/photos/9979107/pexels-photo-9979107.jpeg', 'classique', 'Automatique', 'Acier', '100m'),
('Prestige Royal', 4199, 'https://images.pexels.com/photos/9980300/pexels-photo-9980300.jpeg', 'classique', 'Manuel', 'Or blanc', '30m'),
('Distinction', 1999, 'https://images.pexels.com/photos/9978818/pexels-photo-9978818.jpeg', 'classique', 'Quartz', 'Acier', '50m'),
('Majesté', 3599, 'https://images.pexels.com/photos/9979673/pexels-photo-9979673.jpeg', 'classique', 'Automatique', 'Titane', '100m'),

-- Sport
('Pulse Racing', 1899, 'https://videos.pexels.com/video-files/29280252/12629244_1080_1920_30fps.mp4', 'sport', 'Automatique', 'Titane', '200m'),
('Velocity Master', 2199, 'https://videos.pexels.com/video-files/29280252/12629244_1080_1920_30fps.mp4', 'sport', 'Automatique', 'Carbone', '100m'),
('Endurance Pro', 1699, 'https://images.pexels.com/photos/9980088/pexels-photo-9980088.jpeg', 'sport', 'Quartz', 'Acier inoxydable', '300m'),
('Aqua Sport', 2299, 'https://images.pexels.com/photos/9978735/pexels-photo-9978735.jpeg', 'sport', 'Automatique', 'Acier', '500m'),
('Chrono Sprint', 1999, 'https://images.pexels.com/photos/9979545/pexels-photo-9979545.jpeg', 'sport', 'Chronographe', 'Aluminium', '200m'),
('Extreme Challenge', 2799, 'https://images.pexels.com/photos/9980262/pexels-photo-9980262.jpeg', 'sport', 'Automatique', 'Titane', '1000m'),

-- Luxe
('Diamant Éternel', 8999, 'https://images.pexels.com/photos/9980432/pexels-photo-9980432.jpeg', 'luxe', 'Automatique', 'Or blanc', '50m'),
('Platine Royale', 12999, 'https://images.pexels.com/photos/9979231/pexels-photo-9979231.jpeg', 'luxe', 'Tourbillon', 'Platine', '30m'),
('Or Suprême', 7499, 'https://images.pexels.com/photos/9978952/pexels-photo-9978952.jpeg', 'luxe', 'Automatique', 'Or jaune', '100m'),
('Cristal Précieux', 15999, 'https://images.pexels.com/photos/9980567/pexels-photo-9980567.jpeg', 'luxe', 'Grande Complication', 'Cristal', '30m'),
('Saphir Noir', 6999, 'https://images.pexels.com/photos/9979456/pexels-photo-9979456.jpeg', 'luxe', 'Automatique', 'Céramique', '200m'),
('Perle Nacre', 19999, 'https://images.pexels.com/photos/9978642/pexels-photo-9978642.jpeg', 'luxe', 'Tourbillon', 'Nacre', '50m'),

-- Vintage
('Heritage 1960', 3899, 'https://images.pexels.com/photos/9979107/pexels-photo-9979107.jpeg', 'vintage', 'Manuel', 'Or jaune', '30m'),
('Rétro Classic', 2799, 'https://images.pexels.com/photos/9980871/pexels-photo-9980871.jpeg', 'vintage', 'Automatique', 'Acier vieilli', '50m'),
('Nostalgie', 3299, 'https://images.pexels.com/photos/9979776/pexels-photo-9979776.jpeg', 'vintage', 'Manuel', 'Laiton', '30m'),
('Époque Dorée', 4199, 'https://images.pexels.com/photos/9980300/pexels-photo-9980300.jpeg', 'vintage', 'Automatique', 'Or rose', '30m'),
('Collector 1970', 5499, 'https://images.pexels.com/photos/9978818/pexels-photo-9978818.jpeg', 'vintage', 'Manuel', 'Platine', '50m'),
('Vintage Master', 3599, 'https://images.pexels.com/photos/9979673/pexels-photo-9979673.jpeg', 'vintage', 'Automatique', 'Acier', '100m'),

-- Femme
('Élégance Féminine', 2299, 'https://images.pexels.com/photos/9980088/pexels-photo-9980088.jpeg', 'femme', 'Automatique', 'Or rose', '50m'),
('Diamant Rose', 3999, 'https://images.pexels.com/photos/9978735/pexels-photo-9978735.jpeg', 'femme', 'Quartz', 'Or blanc', '30m'),
('Perle Nacrée', 2799, 'https://images.pexels.com/photos/9979545/pexels-photo-9979545.jpeg', 'femme', 'Automatique', 'Nacre', '50m'),
('Saphir Bleu', 4599, 'https://images.pexels.com/photos/9980262/pexels-photo-9980262.jpeg', 'femme', 'Manuel', 'Platine', '30m'),
('Délicate', 1999, 'https://images.pexels.com/photos/9979892/pexels-photo-9979892.jpeg', 'femme', 'Quartz', 'Acier', '100m'),
('Grâce Éternelle', 3299, 'https://images.pexels.com/photos/9978869/pexels-photo-9978869.jpeg', 'femme', 'Automatique', 'Or rose', '50m'),

-- Édition Limitée
('Skeleton X', 8999, 'https://images.pexels.com/photos/9980432/pexels-photo-9980432.jpeg', 'édition limitée', 'Tourbillon', 'Titane', '200m'),
('Lunar Phase', 12999, 'https://images.pexels.com/photos/9979231/pexels-photo-9979231.jpeg', 'édition limitée', 'Perpétuel', 'Or blanc', '50m'),
('Carbon Fiber', 7499, 'https://images.pexels.com/photos/9978952/pexels-photo-9978952.jpeg', 'édition limitée', 'Automatique', 'Carbone', '300m'),
('Anniversary 100', 15999, 'https://images.pexels.com/photos/9980567/pexels-photo-9980567.jpeg', 'édition limitée', 'Grande Complication', 'Platine', '30m'),
('Limited Black', 6999, 'https://images.pexels.com/photos/9979456/pexels-photo-9979456.jpeg', 'édition limitée', 'Automatique', 'Céramique', '200m'),
('Exclusive Gold', 19999, 'https://images.pexels.com/photos/9978642/pexels-photo-9978642.jpeg', 'édition limitée', 'Tourbillon', 'Or massif', '50m');

-- Vérification
SELECT 'Script exécuté avec succès!' as message;
SELECT COUNT(*) as total_products FROM products;
SELECT category, COUNT(*) as count FROM products GROUP BY category; 