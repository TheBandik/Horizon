package thebandik.horizon.backend.search;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import thebandik.horizon.backend.catalog.mediaType.MediaTypeRepository;
import thebandik.horizon.backend.integrations.ExternalProvider;
import thebandik.horizon.backend.integrations.MediaExternalRepository;
import thebandik.horizon.backend.integrations.rawg.RawgClient;
import thebandik.horizon.backend.media.MediaRepository;
import thebandik.horizon.backend.media.dto.MediaResponse;
import thebandik.horizon.backend.search.dto.ExternalGameSearchItem;
import thebandik.horizon.backend.search.dto.MixedMediaSearchResponse;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MixedMediaSearchService {

    private static final String GAME_MEDIA_TYPE_NAME = "Game";

    private static final int LOCAL_LIMIT = 10;
    private static final int RAWG_PAGE = 1;
    private static final int RAWG_LIMIT = 10;

    private final MediaRepository mediaRepository;
    private final MediaTypeRepository mediaTypeRepository;
    private final RawgClient rawgClient;
    private final MediaExternalRepository mediaExternalRepository;

    public MixedMediaSearchResponse search(String q, Long mediaTypeId) {
        // 1) Локальный поиск по выбранному типу
        var localPage = mediaRepository.searchMediaByTitle(q, PageRequest.of(0, LOCAL_LIMIT), mediaTypeId);
        List<MediaResponse> local = localPage.getContent().stream()
                .map(MediaResponse::from)
                .toList();

        // 2) RAWG только для Game
        boolean isGame = mediaTypeRepository.findById(mediaTypeId)
                .map(mt -> mt.getName() != null && mt.getName().equalsIgnoreCase(GAME_MEDIA_TYPE_NAME))
                .orElse(false);

        if (!isGame) {
            return new MixedMediaSearchResponse(local, List.of());
        }

        var rawgResp = rawgClient.searchGames(q, RAWG_PAGE, RAWG_LIMIT);
        if (rawgResp.results() == null || rawgResp.results().isEmpty()) {
            return new MixedMediaSearchResponse(local, List.of());
        }

        // 3) Проверка, что уже импортировано
        List<String> ids = rawgResp.results().stream()
                .map(r -> String.valueOf(r.id()))
                .toList();

        Set<String> existing = new HashSet<>(mediaExternalRepository
                .findExistingExternalIds(ExternalProvider.RAWG, ids));

        // 4) Ответ
        List<ExternalGameSearchItem> rawg = rawgResp.results().stream()
                .map(g -> {
                    String externalId = String.valueOf(g.id());
                    return new ExternalGameSearchItem(
                            "RAWG",
                            externalId,
                            g.name(),
                            g.released(),
                            g.backgroundImage(),
                            existing.contains(externalId)
                    );
                })
                .toList();

        return new MixedMediaSearchResponse(local, rawg);
    }
}
