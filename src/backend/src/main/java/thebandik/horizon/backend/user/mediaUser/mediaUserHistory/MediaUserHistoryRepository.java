package thebandik.horizon.backend.user.mediaUser.mediaUserHistory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MediaUserHistoryRepository extends JpaRepository<MediaUserHistory, Long> {

    List<MediaUserHistory> findByMediaUserIdOrderByCreatedAtDesc(Long mediaUserId);

    long countByMediaUserId(Long mediaUserId);

    @Query("select min(h.eventDate) from MediaUserHistory h where h.mediaUser.id = :mediaUserId and h.eventDate is not null")
    LocalDate minEventDate(@Param("mediaUserId") Long mediaUserId);

    @Query("select max(h.eventDate) from MediaUserHistory h where h.mediaUser.id = :mediaUserId and h.eventDate is not null")
    LocalDate maxEventDate(@Param("mediaUserId") Long mediaUserId);

    Optional<MediaUserHistory> findFirstByMediaUserIdOrderByEventDateDescIdDesc(Long mediaUserId);

    Optional<MediaUserHistory> findByIdAndMediaUserId(Long id, Long mediaUserId);

    @Modifying
    @Query("delete from MediaUserHistory h where h.id = :id and h.mediaUser.id = :mediaUserId")
    int deleteByIdAndMediaUserId(@Param("id") Long id, @Param("mediaUserId") Long mediaUserId);
}
