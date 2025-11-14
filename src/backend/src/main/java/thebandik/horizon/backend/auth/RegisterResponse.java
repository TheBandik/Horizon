package thebandik.horizon.backend.auth;

public record RegisterResponse(
        Long id,
        String email,
        String username,
        String message
) {
}
