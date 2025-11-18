package thebandik.horizon.backend.auth.dto;

public record LoginRequest(
        String email,
        String password
) {
}
