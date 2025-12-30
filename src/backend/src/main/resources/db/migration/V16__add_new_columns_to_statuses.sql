ALTER TABLE statuses
    ADD COLUMN IF NOT EXISTS code  VARCHAR(64) UNIQUE,
    ADD COLUMN IF NOT EXISTS scope VARCHAR(64);

INSERT INTO statuses(name, code, scope)
VALUES ('Wishlist', 'WISHLIST', 'ALL'),
       ('On Hold', 'ON_HOLD', 'ALL'),
       ('Dropped', 'DROPPED', 'ALL'),

       ('Watched', 'WATCHED', 'MOVIE'),

       ('Read', 'READ', 'BOOK'),

       ('Completed', 'GAME_STORY', 'GAME'),
       ('Played', 'GAME_ENDLESS', 'GAME'),
       ('Perfected', 'GAME_100', 'GAME')
ON CONFLICT (code) DO NOTHING;

ALTER TABLE statuses
    ALTER COLUMN code SET NOT NULL,
    ALTER COLUMN scope SET NOT NULL;
