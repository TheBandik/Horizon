package thebandik.horizon.backend.auth;

public record LoginRequest(
        String email,
        String password
) {
}
