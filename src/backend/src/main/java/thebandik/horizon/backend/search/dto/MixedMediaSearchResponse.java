package thebandik.horizon.backend.search.dto;

import thebandik.horizon.backend.media.dto.MediaResponse;

import java.util.List;

public record MixedMediaSearchResponse(
        List<MediaResponse> local,
        List<ExternalGameSearchItem> rawg
) {
}
