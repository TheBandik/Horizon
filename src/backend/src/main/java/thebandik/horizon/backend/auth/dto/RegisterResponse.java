package thebandik.horizon.backend.auth.dto;

public record RegisterResponse(
        Long id,
        String email,
        String username,
        String message
) {
}
