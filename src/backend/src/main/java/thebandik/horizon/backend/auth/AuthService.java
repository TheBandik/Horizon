package thebandik.horizon.backend.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import thebandik.horizon.backend.auth.error.EmailAlreadyExistsException;
import thebandik.horizon.backend.auth.error.EmailNotFoundException;
import thebandik.horizon.backend.auth.error.UnauthorizedException;
import thebandik.horizon.backend.auth.error.UsernameAlreadyExistsException;
import thebandik.horizon.backend.user.User;
import thebandik.horizon.backend.user.UserRepository;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
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
        user.setPasswordHash(passwordEncoder.encode(request.password()));

        return users.save(user);
    }

    public User login(LoginRequest request) {

        User user = users.findByEmail(request.email()).orElseThrow(() -> new EmailNotFoundException(request.email()));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException(request.email());
        }

        return user;
    }
}
