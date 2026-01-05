package thebandik.horizon.backend.user.mediaUser;

import org.springframework.stereotype.Component;
import thebandik.horizon.backend.catalog.mediaType.MediaTypeEntity;
import thebandik.horizon.backend.catalog.mediaType.dto.MediaTypeResponse;
import thebandik.horizon.backend.catalog.status.Status;
import thebandik.horizon.backend.catalog.status.dto.StatusResponse;
import thebandik.horizon.backend.media.Media;
import thebandik.horizon.backend.media.dto.MediaResponse;
import thebandik.horizon.backend.user.mediaUser.dto.MediaUserDetailsResponse;
import thebandik.horizon.backend.user.mediaUser.dto.MediaUserGetByMediaTypeResponse;
import thebandik.horizon.backend.user.mediaUser.mediaUserHistory.dto.MediaUserHistoryResponse;
import thebandik.horizon.backend.user.mediaUser.dto.MediaUserResponse;

import java.util.List;

@Component
public class MediaUserMapper {
    public MediaUserGetByMediaTypeResponse getByMediaTypeToResponse(MediaUser mediaUser) {
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
                        status.getName(),
                        status.getCode(),
                        status.getScope()
                ),
                mediaUser.getRating(),
                mediaUser.getLastEventDate()
        );
    }

    public MediaUserResponse toResponse(MediaUser mediaUser) {
        return new MediaUserResponse(
                mediaUser.getId(),
                mediaUser.getMedia().getId(),
                mediaUser.getUser().getId(),
                mediaUser.getStatus().getId(),
                mediaUser.getRating(),
                mediaUser.getFirstEventDate(),
                mediaUser.getLastEventDate(),
                mediaUser.getHistoryCount()
        );
    }

    public MediaUserDetailsResponse detailsToResponse(MediaUser mediaUser, List<MediaUserHistoryResponse> history) {
        return new MediaUserDetailsResponse(
                mediaUser.getId(),
                mediaUser.getMedia().getId(),
                mediaUser.getUser().getId(),
                mediaUser.getStatus().getId(),
                mediaUser.getRating(),
                mediaUser.getFirstEventDate(),
                mediaUser.getLastEventDate(),
                mediaUser.getHistoryCount(),
                history
        );
    }
}
