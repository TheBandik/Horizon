package thebandik.horizon.backend.auth.dto;

public record LoginRequest(
        String login,
        String password
) {
}
