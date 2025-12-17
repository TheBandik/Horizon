package thebandik.horizon.backend.media.mediaCompanyRole.dto;

public record MediaCompanyRoleResponse(
        Long id,
        Long mediaId,
        Long companyId,
        Long roleId
) {
}
