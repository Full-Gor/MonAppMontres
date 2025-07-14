-- Script complet pour configurer la base de données MonAppMontres
-- Version finale avec noms de colonnes français
-- Exécuter ce script dans l'ordre dans Supabase SQL Editor

-- 1. Créer la table users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    avatar TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer la table products avec noms français
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image TEXT,
    category VARCHAR(50) NOT NULL DEFAULT 'classique',
    mechanism VARCHAR(100),
    material VARCHAR(100),
    waterResistance VARCHAR(50),
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer la table orders
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'en cours',
    payment_intent_id VARCHAR(255),
    items JSONB,
    shipping_address TEXT,
    tracking_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Créer la table favorites
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- 5. Créer la table messages
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'question',
    is_from_admin BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Créer la table cart_items
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- 7. Créer des index
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_admin_id ON messages(admin_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);

-- 8. Activer RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- 9. Créer les politiques RLS
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = true
        )
    );

CREATE POLICY "Users can manage own favorites" ON favorites
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own messages" ON messages
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = admin_id);
CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can send messages" ON messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = true
        )
    );

CREATE POLICY "Users can manage own cart" ON cart_items
    FOR ALL USING (auth.uid() = user_id);

-- 10. Insérer l'utilisateur admin
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin123@gmail.com') THEN
        INSERT INTO users (id, name, email, is_admin) VALUES 
            ('00000000-0000-0000-0000-000000000001', 'Admin', 'admin123@gmail.com', true);
    END IF;
END $$;

-- 11. Supprimer les anciens produits et insérer les nouveaux
DELETE FROM products;

-- Produits Classiques
INSERT INTO products (name, price, image, category, mechanism, material, waterResistance, stock) VALUES
    ('Révélation Classique', 2499, 'https://videos.pexels.com/video-files/6827301/6827301-uhd_2560_1440_25fps.mp4', 'classique', 'Automatique', 'Acier inoxydable', '50m', 10),
    ('Tradition Éternelle', 3299, 'https://videos.pexels.com/video-files/856199/856199-hd_1920_1080_25fps.mp4', 'classique', 'Manuel', 'Or rose', '30m', 5),
    ('Héritage Noble', 2799, 'https://images.pexels.com/photos/9979107/pexels-photo-9979107.jpeg', 'classique', 'Automatique', 'Acier', '100m', 8),
    ('Prestige Royal', 4199, 'https://images.pexels.com/photos/9980300/pexels-photo-9980300.jpeg', 'classique', 'Manuel', 'Or blanc', '30m', 3),
    ('Distinction', 1999, 'https://images.pexels.com/photos/9978818/pexels-photo-9978818.jpeg', 'classique', 'Quartz', 'Acier', '50m', 15),
    ('Majesté', 3599, 'https://images.pexels.com/photos/9979673/pexels-photo-9979673.jpeg', 'classique', 'Automatique', 'Titane', '100m', 7);

-- Produits Sport
INSERT INTO products (name, price, image, category, mechanism, material, waterResistance, stock) VALUES
    ('Pulse Racing', 1899, 'https://videos.pexels.com/video-files/29280252/12629244_1080_1920_30fps.mp4', 'sport', 'Automatique', 'Titane', '200m', 12),
    ('Velocity Master', 2199, 'https://videos.pexels.com/video-files/29280252/12629244_1080_1920_30fps.mp4', 'sport', 'Automatique', 'Carbone', '100m', 8),
    ('Endurance Pro', 1699, 'https://images.pexels.com/photos/9980088/pexels-photo-9980088.jpeg', 'sport', 'Quartz', 'Acier inoxydable', '300m', 10),
    ('Aqua Sport', 2299, 'https://images.pexels.com/photos/9978735/pexels-photo-9978735.jpeg', 'sport', 'Automatique', 'Acier', '500m', 6),
    ('Chrono Sprint', 1999, 'https://images.pexels.com/photos/9979545/pexels-photo-9979545.jpeg', 'sport', 'Chronographe', 'Aluminium', '200m', 9),
    ('Extreme Challenge', 2799, 'https://images.pexels.com/photos/9980262/pexels-photo-9980262.jpeg', 'sport', 'Automatique', 'Titane', '1000m', 4);

-- Produits Luxe
INSERT INTO products (name, price, image, category, mechanism, material, waterResistance, stock) VALUES
    ('Diamant Éternel', 8999, 'https://images.pexels.com/photos/9980432/pexels-photo-9980432.jpeg', 'luxe', 'Automatique', 'Or blanc', '50m', 2),
    ('Platine Royale', 12999, 'https://images.pexels.com/photos/9979231/pexels-photo-9979231.jpeg', 'luxe', 'Tourbillon', 'Platine', '30m', 1),
    ('Or Suprême', 7499, 'https://images.pexels.com/photos/9978952/pexels-photo-9978952.jpeg', 'luxe', 'Automatique', 'Or jaune', '100m', 3),
    ('Cristal Précieux', 15999, 'https://images.pexels.com/photos/9980567/pexels-photo-9980567.jpeg', 'luxe', 'Grande Complication', 'Cristal', '30m', 1),
    ('Saphir Noir', 6999, 'https://images.pexels.com/photos/9979456/pexels-photo-9979456.jpeg', 'luxe', 'Automatique', 'Céramique', '200m', 2),
    ('Perle Nacre', 19999, 'https://images.pexels.com/photos/9978642/pexels-photo-9978642.jpeg', 'luxe', 'Tourbillon', 'Nacre', '50m', 1);

-- Produits Vintage
INSERT INTO products (name, price, image, category, mechanism, material, waterResistance, stock) VALUES
    ('Heritage 1960', 3899, 'https://images.pexels.com/photos/9979107/pexels-photo-9979107.jpeg', 'vintage', 'Manuel', 'Or jaune', '30m', 3),
    ('Rétro Classic', 2799, 'https://images.pexels.com/photos/9980871/pexels-photo-9980871.jpeg', 'vintage', 'Automatique', 'Acier vieilli', '50m', 5),
    ('Nostalgie', 3299, 'https://images.pexels.com/photos/9979776/pexels-photo-9979776.jpeg', 'vintage', 'Manuel', 'Laiton', '30m', 4),
    ('Époque Dorée', 4199, 'https://images.pexels.com/photos/9980300/pexels-photo-9980300.jpeg', 'vintage', 'Automatique', 'Or rose', '30m', 2),
    ('Collector 1970', 5499, 'https://images.pexels.com/photos/9978818/pexels-photo-9978818.jpeg', 'vintage', 'Manuel', 'Platine', '50m', 1),
    ('Vintage Master', 3599, 'https://images.pexels.com/photos/9979673/pexels-photo-9979673.jpeg', 'vintage', 'Automatique', 'Acier', '100m', 3);

-- Produits Femme
INSERT INTO products (name, price, image, category, mechanism, material, waterResistance, stock) VALUES
    ('Élégance Féminine', 2299, 'https://images.pexels.com/photos/9980088/pexels-photo-9980088.jpeg', 'femme', 'Automatique', 'Or rose', '50m', 8),
    ('Diamant Rose', 3999, 'https://images.pexels.com/photos/9978735/pexels-photo-9978735.jpeg', 'femme', 'Quartz', 'Or blanc', '30m', 4),
    ('Perle Nacrée', 2799, 'https://images.pexels.com/photos/9979545/pexels-photo-9979545.jpeg', 'femme', 'Automatique', 'Nacre', '50m', 6),
    ('Saphir Bleu', 4599, 'https://images.pexels.com/photos/9980262/pexels-photo-9980262.jpeg', 'femme', 'Manuel', 'Platine', '30m', 3),
    ('Délicate', 1999, 'https://images.pexels.com/photos/9979892/pexels-photo-9979892.jpeg', 'femme', 'Quartz', 'Acier', '100m', 10),
    ('Grâce Éternelle', 3299, 'https://images.pexels.com/photos/9978869/pexels-photo-9978869.jpeg', 'femme', 'Automatique', 'Or rose', '50m', 5);

-- Produits Édition Limitée
INSERT INTO products (name, price, image, category, mechanism, material, waterResistance, stock) VALUES
    ('Skeleton X', 8999, 'https://images.pexels.com/photos/9980432/pexels-photo-9980432.jpeg', 'édition limitée', 'Tourbillon', 'Titane', '200m', 1),
    ('Lunar Phase', 12999, 'https://images.pexels.com/photos/9979231/pexels-photo-9979231.jpeg', 'édition limitée', 'Perpétuel', 'Or blanc', '50m', 1),
    ('Carbon Fiber', 7499, 'https://images.pexels.com/photos/9978952/pexels-photo-9978952.jpeg', 'édition limitée', 'Automatique', 'Carbone', '300m', 2),
    ('Anniversary 100', 15999, 'https://images.pexels.com/photos/9980567/pexels-photo-9980567.jpeg', 'édition limitée', 'Grande Complication', 'Platine', '30m', 1),
    ('Limited Black', 6999, 'https://images.pexels.com/photos/9979456/pexels-photo-9979456.jpeg', 'édition limitée', 'Automatique', 'Céramique', '200m', 2),
    ('Exclusive Gold', 19999, 'https://images.pexels.com/photos/9978642/pexels-photo-9978642.jpeg', 'édition limitée', 'Tourbillon', 'Or massif', '50m', 1);

-- 12. Créer les fonctions et triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 13. Créer une vue pour les statistiques
CREATE OR REPLACE VIEW admin_stats AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE is_admin = false) as total_users,
    (SELECT COUNT(*) FROM products) as total_products,
    (SELECT COUNT(*) FROM orders) as total_orders,
    (SELECT COALESCE(SUM(total), 0) FROM orders WHERE status = 'payé') as total_sales,
    (SELECT COUNT(*) FROM favorites) as total_favorites,
    (SELECT COUNT(*) FROM messages) as total_messages;

-- Message de succès
SELECT 'Base de données configurée avec succès! 🚀' as message,
       (SELECT COUNT(*) FROM products) as produits_ajoutés,
       (SELECT COUNT(*) FROM users WHERE is_admin = true) as admins_créés; 