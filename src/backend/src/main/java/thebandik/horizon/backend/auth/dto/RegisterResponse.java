package thebandik.horizon.backend.auth.dto;

public record RegisterResponse(
        Long id,
        String username,
        String email
) {
}
