package thebandik.horizon.backend.user.mediaUser;

import org.springframework.stereotype.Component;
import thebandik.horizon.backend.catalog.mediaType.MediaTypeEntity;
import thebandik.horizon.backend.catalog.mediaType.dto.MediaTypeResponse;
import thebandik.horizon.backend.catalog.status.Status;
import thebandik.horizon.backend.catalog.status.dto.StatusResponse;
import thebandik.horizon.backend.media.Media;
import thebandik.horizon.backend.media.dto.MediaResponse;
import thebandik.horizon.backend.user.mediaUser.dto.MediaUserGetByMediaTypeResponse;

@Component
public class MediaUserMapper {
    public MediaUserGetByMediaTypeResponse toResponse(MediaUser mediaUser) {
        Media media = mediaUser.getMedia();
        MediaTypeEntity mediaType = mediaUser.getMedia().getMediaType();
        Status status = mediaUser.getStatus();

        return new MediaUserGetByMediaTypeResponse(
                mediaUser.getId(),
                new MediaResponse(
                        media.getId(),
                        media.getTitle(),
                        media.getOriginalTitle(),
                        media.getPoster(),
                        media.getReleaseDate(),
                        new MediaTypeResponse(
                                mediaType.getId(),
                                mediaType.getName()
                        )
                ),
                new StatusResponse(
                        status.getId(),
                        status.getName()
                ),
                mediaUser.getRating(),
                mediaUser.getLastEventDate()
        );
    }
}
