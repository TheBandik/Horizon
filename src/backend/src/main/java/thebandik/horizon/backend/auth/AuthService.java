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
        String email = request.email();
        String username = request.username();

        if (users.existsByEmail(email)) {
            throw new EmailAlreadyExistsException(email);
        }

        if (users.existsByUsername(username)) {
            throw new UsernameAlreadyExistsException(username);
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(request.password());

        return users.save(user);
    }
}
