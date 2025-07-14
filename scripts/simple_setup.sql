-- Script de configuration complète de la base de données
-- Exécuter dans Supabase SQL Editor

-- 1. Supprimer les tables existantes si elles existent (dans le bon ordre)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 2. Créer la table des catégories
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer la table des produits avec category_id
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image TEXT NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Créer la table des favoris
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- 5. Créer la table des messages
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Créer la table des commandes
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Créer la table des éléments de commande
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Activer RLS (Row Level Security)
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 9. Créer les politiques RLS
CREATE POLICY "Users can view their own favorites" ON favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own messages" ON messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- 10. Insérer les catégories
INSERT INTO categories (name) VALUES 
    ('Montres de Luxe'),
    ('Montres Sport'),
    ('Montres Classiques'),
    ('Montres Connectées'),
    ('Montres Vintage'),
    ('Montres Femme');

-- 11. Insérer les produits
INSERT INTO products (name, price, image, category_id) VALUES 
    -- Montres de Luxe (category_id = 1)
    ('Rolex Submariner', 8500.00, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 1),
    ('Omega Seamaster', 4200.00, 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400', 1),
    ('TAG Heuer Carrera', 3500.00, 'https://images.unsplash.com/photo-1509048191080-d2abbc36b2bc?w=400', 1),
    ('Breitling Navitimer', 5200.00, 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400', 1),
    ('Patek Philippe Calatrava', 25000.00, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400', 1),
    ('Audemars Piguet Royal Oak', 18000.00, 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400', 1),
    
    -- Montres Sport (category_id = 2)
    ('Casio G-Shock', 150.00, 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400', 2),
    ('Suunto Core', 320.00, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400', 2),
    ('Garmin Fenix', 650.00, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400', 2),
    ('Polar Vantage', 450.00, 'https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?w=400', 2),
    ('Timex Ironman', 89.00, 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400', 2),
    ('Seiko Prospex', 280.00, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400', 2),
    
    -- Montres Classiques (category_id = 3)
    ('Tissot Le Locle', 425.00, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400', 3),
    ('Hamilton Jazzmaster', 595.00, 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400', 3),
    ('Longines Master', 1200.00, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 3),
    ('Frederique Constant', 850.00, 'https://images.unsplash.com/photo-1509048191080-d2abbc36b2bc?w=400', 3),
    ('Junghans Max Bill', 680.00, 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400', 3),
    ('Nomos Tangente', 1450.00, 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400', 3),
    
    -- Montres Connectées (category_id = 4)
    ('Apple Watch Series 9', 429.00, 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400', 4),
    ('Samsung Galaxy Watch', 329.00, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400', 4),
    ('Garmin Venu', 399.00, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400', 4),
    ('Fitbit Versa', 199.00, 'https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?w=400', 4),
    ('Huawei Watch GT', 249.00, 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400', 4),
    ('Amazfit GTR', 139.00, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400', 4),
    
    -- Montres Vintage (category_id = 5)
    ('Seiko 5 Vintage', 180.00, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400', 5),
    ('Omega Speedmaster Vintage', 3200.00, 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400', 5),
    ('Rolex Datejust Vintage', 6500.00, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 5),
    ('Heuer Monaco Vintage', 4800.00, 'https://images.unsplash.com/photo-1509048191080-d2abbc36b2bc?w=400', 5),
    ('Jaeger-LeCoultre Reverso', 7200.00, 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400', 5),
    ('Cartier Tank Vintage', 5500.00, 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400', 5),
    
    -- Montres Femme (category_id = 6)
    ('Chanel J12', 4200.00, 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400', 6),
    ('Dior Grand Bal', 3800.00, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400', 6),
    ('Cartier Ballon Bleu', 2900.00, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400', 6),
    ('Bulgari Serpenti', 3500.00, 'https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?w=400', 6),
    ('Tiffany & Co Atlas', 2200.00, 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400', 6),
    ('Van Cleef & Arpels', 8500.00, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400', 6);

-- 12. Vérifier que tout est bien inséré
SELECT 'Configuration terminée avec succès!' as message;
SELECT 'Catégories créées:' as info, COUNT(*) as count FROM categories;
SELECT 'Produits créés:' as info, COUNT(*) as count FROM products; 