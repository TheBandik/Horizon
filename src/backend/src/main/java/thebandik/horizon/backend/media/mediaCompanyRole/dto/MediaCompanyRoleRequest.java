package thebandik.horizon.backend.media.mediaCompanyRole.dto;

public record MediaCompanyRoleRequest(
        Long mediaId,
        Long companyId,
        Long roleId
) {
}
