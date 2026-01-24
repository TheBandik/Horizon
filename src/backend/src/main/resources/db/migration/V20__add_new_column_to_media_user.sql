ALTER TABLE media_user
    ADD COLUMN IF NOT EXISTS last_event_precision date_precision;

UPDATE media_user AS mu
SET last_event_precision = sub.precision
FROM (
         SELECT DISTINCT ON (h.media_user_id)
             h.media_user_id,
             h.precision
         FROM media_user_history AS h
         ORDER BY h.media_user_id, h.event_date DESC, h.id DESC
     ) sub
WHERE mu.id = sub.media_user_id;
