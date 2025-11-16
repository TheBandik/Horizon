package thebandik.horizon.backend.catalog.mediaType.error;

import org.springframework.http.HttpStatus;
import thebandik.horizon.backend.common.ApiException;

public class MediaTypeAlreadyExistsException extends ApiException {

    public MediaTypeAlreadyExistsException(String name) {
        super(
                "MEDIA_TYPE_ALREADY_EXISTS",
                "Media type already exists: " + name,
                HttpStatus.CONFLICT
        );
    }
}
