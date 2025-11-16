package thebandik.horizon.backend.common.errors;

import org.springframework.http.HttpStatus;
import thebandik.horizon.backend.common.ApiException;

public class NotFoundException extends ApiException {
    public NotFoundException(String code, String message, String obj) {
        super(
                code + "_NOT_FOUND",
                message + " not found: " + obj,
                HttpStatus.NOT_FOUND
        );
    }
}
