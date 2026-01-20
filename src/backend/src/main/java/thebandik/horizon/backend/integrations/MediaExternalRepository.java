package thebandik.horizon.backend.integrations;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface MediaExternalRepository extends JpaRepository<MediaExternal, Long> {
    Optional<MediaExternal> findByProviderAndExternalId(ExternalProvider provider, String externalId);

    @Query("""
            select me.externalId
            from MediaExternal me
            where me.provider = :provider and me.externalId in :externalIds
            """)
    List<String> findExistingExternalIds(
            @Param("provider") ExternalProvider provider,
            @Param("externalIds") Collection<String> externalIds
    );
}
