package thebandik.horizon.backend.search.dto;

public record ExternalGameSearchItem(
        String provider,
        String externalId,
        String title,
        String released,
        String poster,
        boolean alreadyImported
) {
}
