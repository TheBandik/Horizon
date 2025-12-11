package thebandik.horizon.backend.media.mediaCompanyRole;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MediaCompanyRoleRepository extends JpaRepository<MediaCompanyRole, Long> {
    boolean existsByMediaIdAndCompanyIdAndRoleId(Long mediaId, Long companyId, Long roleId);
}
