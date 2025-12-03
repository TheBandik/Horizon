package thebandik.horizon.backend.common.errors;

import org.springframework.http.HttpStatus;
import thebandik.horizon.backend.common.ApiException;

public class UnauthorizedException extends ApiException {

    public UnauthorizedException(String login) {
        super(
                "UNAUTHORIZED",
                "Invalid password for " + login,
                HttpStatus.UNAUTHORIZED
        );
    }
}
