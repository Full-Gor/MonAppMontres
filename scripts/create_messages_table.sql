-- Table des messages entre users et admin
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'question', -- 'question' ou 'response'
    is_from_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Index pour améliorer les performances
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_admin_id ON messages(admin_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC); 