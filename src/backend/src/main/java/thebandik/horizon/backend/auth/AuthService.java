package thebandik.horizon.backend.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import thebandik.horizon.backend.auth.dto.LoginRequest;
import thebandik.horizon.backend.auth.dto.LoginResponse;
import thebandik.horizon.backend.auth.dto.RegisterRequest;
import thebandik.horizon.backend.auth.dto.RegisterResponse;
import thebandik.horizon.backend.common.errors.NotFoundException;
import thebandik.horizon.backend.common.errors.UnauthorizedException;
import thebandik.horizon.backend.common.errors.ValidationException;
import thebandik.horizon.backend.user.User;
import thebandik.horizon.backend.user.UserRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final AuthMapper authMapper;
    private final JwtService jwtService;

    public AuthService(
            UserRepository users,
            PasswordEncoder passwordEncoder,
            AuthMapper authMapper,
            JwtService jwtService
    ) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.authMapper = authMapper;
        this.jwtService = jwtService;
    }

    public RegisterResponse register(RegisterRequest request) {
        String email = request.email();
        String username = request.username();

        Map<String, String> exceptions = new HashMap<>();

        if (users.existsByEmail(email)) {
            exceptions.put("email", "EMAIL_ALREADY_EXISTS");
        }

        if (users.existsByUsername(username)) {
            exceptions.put("username", "USERNAME_ALREADY_EXISTS");
        }

        if (!exceptions.isEmpty()) {
            throw new ValidationException(exceptions);
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));

        return authMapper.registerToResponse(users.save(user));
    }

    public LoginResponse login(LoginRequest request) {
        String login = request.login();
        String password = request.password();

        // Попытка получить пользователя по username
        Optional<User> userByUsername = users.findByUsername(login);

        // Если пользователь не найден по username, то попытка получить его по email
        User user = userByUsername.or(() -> users.findByEmail(login))
                .orElseThrow(() -> new NotFoundException("LOGIN", "Login", request.login()));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new UnauthorizedException(request.login());
        }

        String token = jwtService.generate(user.getId());

        return authMapper.loginToResponse(token);
    }
}
