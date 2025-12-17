package thebandik.horizon.backend.common.faker;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import net.datafaker.Faker;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import thebandik.horizon.backend.catalog.mediaType.MediaTypeEntity;
import thebandik.horizon.backend.catalog.mediaType.MediaTypeRepository;
import thebandik.horizon.backend.media.Media;
import thebandik.horizon.backend.media.MediaRepository;

import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.IntStream;

@Component
@Profile("local")
@RequiredArgsConstructor
public class MediaFaker implements CommandLineRunner {

    private final Faker faker;
    private final MediaRepository mediaRepository;
    private final MediaTypeRepository mediaTypeRepository;

    @Value("${seed.enabled}")
    private boolean enabled;

    @Value("${seed.media-count}")
    private int count;

    @Override
    @Transactional
    public void run(String... args) {
        if (!enabled) return;

        // Не дублировать при каждом запуске
        if (mediaRepository.count() > 0) return;

        List<MediaTypeEntity> mediaTypes = mediaTypeRepository.findAll();
        if (mediaTypes.isEmpty()) {
            throw new IllegalStateException("Media types is empty");
        }

        var list = IntStream.range(0, count)
                .mapToObj(i -> buildMedia(mediaTypes))
                .toList();

        mediaRepository.saveAll(list);
    }

    private Media buildMedia(List<MediaTypeEntity> mediaTypes) {
        Media media = new Media();

        media.setTitle(faker.movie().name());
        media.setOriginalTitle(faker.movie().name());
        media.setPoster(faker.internet().url());
        media.setReleaseDate(faker.timeAndDate().past().atZone(ZoneOffset.UTC).toLocalDate());
        media.setMediaType(faker.options().nextElement(mediaTypes));

        return media;
    }
}
