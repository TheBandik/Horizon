package thebandik.horizon.backend.auth.error;

import org.springframework.http.HttpStatus;
import thebandik.horizon.backend.common.ApiException;

public class EmailNotFoundException extends ApiException {

    public EmailNotFoundException(String email) {
        super(
                "EMAIL_NOT_FOUND",
                "Email not found: " + email,
                HttpStatus.NOT_FOUND
        );
    }
}
