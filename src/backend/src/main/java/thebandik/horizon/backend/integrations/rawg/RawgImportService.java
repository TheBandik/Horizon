package thebandik.horizon.backend.integrations.rawg;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import thebandik.horizon.backend.catalog.mediaType.MediaTypeEntity;
import thebandik.horizon.backend.catalog.mediaType.MediaTypeRepository;
import thebandik.horizon.backend.integrations.ExternalProvider;
import thebandik.horizon.backend.integrations.MediaExternal;
import thebandik.horizon.backend.integrations.MediaExternalRepository;
import thebandik.horizon.backend.integrations.rawg.dto.RawgGameDetails;
import thebandik.horizon.backend.media.Media;
import thebandik.horizon.backend.media.MediaRepository;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class RawgImportService {

    private static final String GAME_MEDIA_TYPE_NAME = "Game";
    private static final LocalDate FALLBACK_RELEASE_DATE = LocalDate.of(1900, 1, 1);

    private final RawgClient rawgClient;
    private final MediaRepository mediaRepository;
    private final MediaExternalRepository mediaExternalRepository;
    private final MediaTypeRepository mediaTypeRepository;

    private static long parseRawgId(String externalId) {
        try {
            return Long.parseLong(externalId);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("RAWG externalId must be numeric, got: " + externalId);
        }
    }

    private static String requireNonBlank(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(message);
        }
        return value;
    }

    private static LocalDate parseReleaseDateOrFallback(String released) {
        if (released == null || released.isBlank()) {
            return FALLBACK_RELEASE_DATE;
        }
        try {
            return LocalDate.parse(released);
        } catch (Exception ignored) {
            return FALLBACK_RELEASE_DATE;
        }
    }

    @Transactional
    public Media importGame(String externalId) {
        // 1) Идемпотентность
        var existing = mediaExternalRepository.findByProviderAndExternalId(ExternalProvider.RAWG, externalId);
        if (existing.isPresent()) {
            return existing.get().getMedia();
        }

        // 2) Получить details
        long rawgId = parseRawgId(externalId);
        RawgGameDetails details = rawgClient.getGameDetails(rawgId);
        if (details == null) {
            throw new IllegalStateException("RAWG details is null for id=" + externalId);
        }

        // 3) Media type = Game
        MediaTypeEntity gameType = mediaTypeRepository.findByNameIgnoreCase(GAME_MEDIA_TYPE_NAME)
                .orElseThrow(() -> new IllegalStateException("MediaType 'Game' not found in DB"));

        // 4) Маппинг
        String title = requireNonBlank(details.name(), "RAWG name is empty for id=" + externalId);
        String originalTitle = (details.nameOriginal() == null || details.nameOriginal().isBlank())
                ? title
                : details.nameOriginal();

        LocalDate releaseDate = parseReleaseDateOrFallback(details.released());

        Media media = new Media();
        media.setTitle(title);
        media.setOriginalTitle(originalTitle);
        media.setPoster(details.backgroundImage());
        media.setReleaseDate(releaseDate);
        media.setMediaType(gameType);

        media = mediaRepository.save(media);

        // 5) Link provider + externalId
        MediaExternal link = new MediaExternal();
        link.setProvider(ExternalProvider.RAWG);
        link.setExternalId(externalId);
        link.setMedia(media);
        link.setLastSyncedAt(OffsetDateTime.now());

        try {
            mediaExternalRepository.save(link);
        } catch (DataIntegrityViolationException e) {
            // Гонка: второй импорт в параллели
            var again = mediaExternalRepository.findByProviderAndExternalId(ExternalProvider.RAWG, externalId);
            if (again.isPresent()) {
                return again.get().getMedia();
            }
            throw e;
        }

        return media;
    }
}
