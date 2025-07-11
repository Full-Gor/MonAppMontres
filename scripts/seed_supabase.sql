-- Remplissage de la table users
INSERT INTO
    users (id, name, email, is_admin)
VALUES (
        '00000000-0000-0000-0000-000000000001',
        'Admin',
        'admin123@gmail.com',
        true
    );

-- Remplissage de la table products
INSERT INTO
    products (
        id,
        name,
        price,
        image,
        category,
        mechanism,
        material,
        waterResistance
    )
VALUES (
        1,
        'Révélation Classique',
        2499,
        'https://videos.pexels.com/video-files/6827301/6827301-uhd_2560_1440_25fps.mp4',
        'classique',
        'Automatique',
        'Acier inoxydable',
        '50m'
    ),
    (
        2,
        'Tradition Éternelle',
        3299,
        'https://videos.pexels.com/video-files/856199/856199-hd_1920_1080_25fps.mp4',
        'classique',
        'Manuel',
        'Or rose',
        '30m'
    ),
    (
        3,
        'Pulse Racing',
        1899,
        'https://videos.pexels.com/video-files/29280252/12629244_1080_1920_30fps.mp4',
        'sport',
        'Automatique',
        'Titane',
        '200m'
    ),
    (
        4,
        'Velocity Master',
        2199,
        'https://videos.pexels.com/video-files/29280252/12629244_1080_1920_30fps.mp4',
        'sport',
        'Automatique',
        'Carbone',
        '100m'
    );

-- Les autres tables peuvent être remplies à la main ou avec d'autres scripts si besoin.