package thebandik.horizon.backend.auth.dto;

public record LoginResponse(
        Long id,
        String username,
        String email
) {
}
