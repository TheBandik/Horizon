package thebandik.horizon.backend.catalog.mediaType.error;

import org.springframework.http.HttpStatus;
import thebandik.horizon.backend.common.ApiException;

public class MediaTypeNotFoundException extends ApiException {

    public MediaTypeNotFoundException(Long id) {
        super(
                "MEDIA_TYPE_NOT_FOUND",
                "Media type not found: " + id,
                HttpStatus.NOT_FOUND
        );
    }
}
