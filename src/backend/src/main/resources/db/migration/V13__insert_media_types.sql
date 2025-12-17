INSERT INTO media_types(name)
VALUES ('Movie'),
       ('Series'),
       ('Game'),
       ('Book'),
       ('Comics')
ON CONFLICT (name) DO NOTHING;