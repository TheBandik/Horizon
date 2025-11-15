package thebandik.horizon.backend.auth.error;

import org.springframework.http.HttpStatus;
import thebandik.horizon.backend.common.ApiException;

public class UnauthorizedException extends ApiException {

    public UnauthorizedException(String email) {
        super(
                "UNAUTHORIZED",
                "Invalid password for " + email,
                HttpStatus.UNAUTHORIZED
        );
    }
}
