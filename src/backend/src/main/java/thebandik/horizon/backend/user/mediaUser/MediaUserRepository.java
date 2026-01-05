package thebandik.horizon.backend.user.mediaUser;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MediaUserRepository extends JpaRepository<MediaUser, Long> {
    Optional<MediaUser> findByUserIdAndMediaId(Long userId, Long mediaId);

    List<MediaUser> findByUserIdAndMedia_MediaType_Id(Long userId, Long aLong);

    @Modifying
    @Query("delete from MediaUser mu where mu.user.id = :userId and mu.media.id = :mediaId")
    int deleteByUserIdAndMediaId(@Param("userId") Long userId, @Param("mediaId") Long mediaId);
}
