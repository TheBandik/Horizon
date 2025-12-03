package thebandik.horizon.backend.common.errors;

import org.springframework.http.HttpStatus;
import thebandik.horizon.backend.common.ApiException;

import java.util.Map;

public class ValidationException extends ApiException {
    public ValidationException(Map<String, String> exceptions) {
        super(
                "VALIDATION_FAILED",
                "Validation failed",
                HttpStatus.CONFLICT,
                exceptions
        );
    }
}
