package thebandik.horizon.backend.auth;

import org.springframework.http.HttpStatus;
import thebandik.horizon.backend.common.ApiException;

public class UsernameAlreadyExistsException extends ApiException {

    public UsernameAlreadyExistsException(String username) {
        super(
                "USERNAME_ALREADY_EXISTS",
                "Username already exists: " + username,
                HttpStatus.CONFLICT
        );
    }
}
