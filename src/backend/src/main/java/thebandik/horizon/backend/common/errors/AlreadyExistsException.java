package thebandik.horizon.backend.common.errors;

import org.springframework.http.HttpStatus;
import thebandik.horizon.backend.common.ApiException;

public class AlreadyExistsException extends ApiException {
    public AlreadyExistsException(String code, String message, String obj) {
        super(
                code + "_ALREADY_EXISTS",
                message + " already exists: " + obj,
                HttpStatus.CONFLICT
        );
    }
}
