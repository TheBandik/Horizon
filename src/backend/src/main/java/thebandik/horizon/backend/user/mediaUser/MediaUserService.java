package thebandik.horizon.backend.user.mediaUser;

import jakarta.transaction.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import thebandik.horizon.backend.catalog.status.Status;
import thebandik.horizon.backend.catalog.status.StatusRepository;
import thebandik.horizon.backend.common.errors.NotFoundException;
import thebandik.horizon.backend.media.Media;
import thebandik.horizon.backend.media.MediaRepository;
import thebandik.horizon.backend.user.User;
import thebandik.horizon.backend.user.UserRepository;
import thebandik.horizon.backend.user.mediaUser.dto.MediaUserCreateRequest;
import thebandik.horizon.backend.user.mediaUser.dto.MediaUserGetByMediaTypeResponse;

import java.time.LocalDate;
import java.util.List;

@Service
public class MediaUserService {

    private final MediaRepository mediaRepository;
    private final UserRepository userRepository;
    private final StatusRepository statusRepository;
    private final MediaUserRepository mediaUserRepository;
    private final MediaUserHistoryRepository mediaUserHistoryRepository;
    private final MediaUserMapper mediaUserMapper;

    public MediaUserService(
            MediaRepository mediaRepository,
            UserRepository userRepository,
            StatusRepository statusRepository,
            MediaUserRepository mediaUserRepository,
            MediaUserHistoryRepository mediaUserHistoryRepository,
            MediaUserMapper mediaUserMapper
    ) {
        this.mediaRepository = mediaRepository;
        this.userRepository = userRepository;
        this.statusRepository = statusRepository;
        this.mediaUserRepository = mediaUserRepository;
        this.mediaUserHistoryRepository = mediaUserHistoryRepository;
        this.mediaUserMapper = mediaUserMapper;
    }

    @Transactional
    public MediaUser create(MediaUserCreateRequest request, Long userId) {
        Long mediaId = request.mediaId();
        Long statusId = request.statusId();
        LocalDate eventDate = request.eventDate();
        DatePrecision precision = DatePrecision.valueOf(request.precision());

        // 1. Получение данных для внесения в БД
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new NotFoundException("MEDIA", "Media", mediaId.toString()));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("USER", "User", userId.toString()));

        Status status = statusRepository.findById(statusId)
                .orElseThrow(() -> new NotFoundException("STATUS", "Status", statusId.toString()));

        // 2. Поиск или создание метакарточки
        MediaUser mediaUser = mediaUserRepository.findByUserIdAndMediaId(userId, mediaId)
                .orElseGet(() -> {
                    MediaUser mu = new MediaUser();
                    mu.setMedia(media);
                    mu.setUser(user);
                    mu.setStatus(status);
                    mu.setRating(request.rating());
                    return mu;
                });

        // 3. Сохранение метакарточки (если новая) с обработкой гонки
        if (mediaUser.getId() == null) {
            try {
                mediaUser = mediaUserRepository.saveAndFlush(mediaUser);
            } catch (DataIntegrityViolationException e) {
                // Если вторая транзакция успела создать запись (гонка), то повторное чтение
                mediaUser = mediaUserRepository.findByUserIdAndMediaId(user.getId(), media.getId())
                        .orElseThrow(() -> e);
            }
        }

        // 4. Добавление события в историю
        MediaUserHistory history = new MediaUserHistory();
        history.setMediaUser(mediaUser);
        history.setEventDate(eventDate);
        history.setPrecision(precision);
        mediaUserHistoryRepository.save(history);

        // 5. Обновление агрегаты
        mediaUser.setHistoryCount(mediaUser.getHistoryCount() + 1);

        if (mediaUser.getFirstEventDate() == null || eventDate.isBefore(mediaUser.getFirstEventDate())) {
            mediaUser.setFirstEventDate(eventDate);
        }

        if (mediaUser.getLastEventDate() == null || eventDate.isAfter(mediaUser.getLastEventDate())) {
            mediaUser.setLastEventDate(eventDate);
        }

        return mediaUserRepository.save(mediaUser);
    }

    public List<MediaUserGetByMediaTypeResponse> getMediaUserByMediaType(
            Long mediaTypeId,
            Long userId
    ) {
        return mediaUserRepository.findByUserIdAndMedia_MediaType_Id(userId, mediaTypeId).stream()
                .map(mediaUserMapper::toResponse)
                .toList();
    }
}
