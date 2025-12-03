package thebandik.horizon.backend.auth;

import org.springframework.stereotype.Component;
import thebandik.horizon.backend.auth.dto.LoginResponse;
import thebandik.horizon.backend.auth.dto.RegisterResponse;
import thebandik.horizon.backend.user.User;

@Component
public class AuthMapper {
    public LoginResponse loginToResponse(User user) {
        return new LoginResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );
    }

    public RegisterResponse registerToResponse(User user) {
        return new RegisterResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );
    }
}
