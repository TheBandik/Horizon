package thebandik.horizon.backend.media.mediaCompanyRole;

import org.springframework.stereotype.Service;
import thebandik.horizon.backend.catalog.company.Company;
import thebandik.horizon.backend.catalog.company.CompanyService;
import thebandik.horizon.backend.catalog.role.Role;
import thebandik.horizon.backend.catalog.role.RoleService;
import thebandik.horizon.backend.common.errors.AlreadyExistsException;
import thebandik.horizon.backend.media.Media;
import thebandik.horizon.backend.media.MediaService;
import thebandik.horizon.backend.media.mediaCompanyRole.dto.MediaCompanyRoleRequest;

@Service
public class MediaCompanyRoleService {

    private final MediaCompanyRoleRepository mediaCompanyRoleRepository;
    private final MediaService mediaService;
    private final CompanyService companyService;
    private final RoleService roleService;

    public MediaCompanyRoleService(MediaCompanyRoleRepository mediaCompanyRoleRepository,
                                   MediaService mediaService,
                                   CompanyService companyService,
                                   RoleService roleService) {
        this.mediaCompanyRoleRepository = mediaCompanyRoleRepository;
        this.mediaService = mediaService;
        this.companyService = companyService;
        this.roleService = roleService;
    }

    public MediaCompanyRole create(MediaCompanyRoleRequest request) {
        Long mediaId = request.mediaId();
        Long companyId = request.companyId();
        Long roleId = request.roleId();

        if (mediaCompanyRoleRepository.existsByMediaIdAndCompanyIdAndRoleId(mediaId, companyId, roleId)) {
            throw new AlreadyExistsException("MEDIA_COMPANY_ROLE", "MediaCompanyRole",
                    mediaId + " + " + companyId + " + " + roleId);
        }

        Media media = mediaService.getById(mediaId);
        Company company = companyService.getById(companyId);
        Role role = roleService.getById(roleId);

        MediaCompanyRole mediaCompanyRole = new MediaCompanyRole();
        mediaCompanyRole.setMedia(media);
        mediaCompanyRole.setCompany(company);
        mediaCompanyRole.setRole(role);

        return mediaCompanyRoleRepository.save(mediaCompanyRole);
    }
}
