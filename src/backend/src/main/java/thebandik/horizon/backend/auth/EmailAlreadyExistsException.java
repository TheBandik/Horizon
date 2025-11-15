package thebandik.horizon.backend.auth;

import org.springframework.http.HttpStatus;
import thebandik.horizon.backend.common.ApiException;

public class EmailAlreadyExistsException extends ApiException {

    public EmailAlreadyExistsException(String email) {
        super(
                "EMAIL_ALREADY_EXISTS",
                "Email already exists: " + email,
                HttpStatus.CONFLICT
        );
    }
}
