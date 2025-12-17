package thebandik.horizon.backend.catalog.mediaType.dto;

import thebandik.horizon.backend.catalog.mediaType.MediaTypeEntity;

public record MediaTypeResponse(
        Long id,
        String name
) {
    public static MediaTypeResponse from(MediaTypeEntity mediaType) {
        return new MediaTypeResponse(
                mediaType.getId(),
                mediaType.getName()
        );
    }
}
