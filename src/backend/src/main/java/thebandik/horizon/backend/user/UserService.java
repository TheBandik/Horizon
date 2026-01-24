package thebandik.horizon.backend.user;

import org.springframework.stereotype.Service;
import thebandik.horizon.backend.common.errors.NotFoundException;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private UserPublicResponse toDto(User user) {
        return new UserPublicResponse(
                user.getId(),
                user.getUsername()
        );
    }

    public UserPublicResponse getById(Long id) {
        return toDto(userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("USER", "User", id.toString())));
    }

    public UserPublicResponse getByUsername(String username) {
        return toDto(userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("USER", "User", username)));
    }
}
