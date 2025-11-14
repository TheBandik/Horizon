package thebandik.horizon.backend.auth;

import org.springframework.stereotype.Service;
import thebandik.horizon.backend.user.User;
import thebandik.horizon.backend.user.UserRepository;

@Service
public class AuthService {

    private final UserRepository users;

    public AuthService(UserRepository users) {
        this.users = users;
    }

    public User register(RegisterRequest request) {
        if (users.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPasswordHash(request.password());

        return users.save(user);
    }
}
