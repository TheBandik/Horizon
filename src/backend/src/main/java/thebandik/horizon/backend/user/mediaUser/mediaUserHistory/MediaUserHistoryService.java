package thebandik.horizon.backend.user.mediaUser.mediaUserHistory;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import thebandik.horizon.backend.common.errors.NotFoundException;
import thebandik.horizon.backend.user.mediaUser.DatePrecision;
import thebandik.horizon.backend.user.mediaUser.MediaUser;
import thebandik.horizon.backend.user.mediaUser.MediaUserRepository;
import thebandik.horizon.backend.user.mediaUser.mediaUserHistory.dto.MediaUserHistoryRequest;
import thebandik.horizon.backend.user.mediaUser.mediaUserHistory.dto.MediaUserHistoryResponse;

import java.time.LocalDate;

@Service
public class MediaUserHistoryService {

    private final MediaUserRepository mediaUserRepository;
    private final MediaUserHistoryRepository mediaUserHistoryRepository;
    private final MediaUserHistoryMapper mediaUserHistoryMapper;

    public MediaUserHistoryService(
            MediaUserRepository mediaUserRepository,
            MediaUserHistoryRepository mediaUserHistoryRepository,
            MediaUserHistoryMapper mediaUserHistoryMapper
    ) {
        this.mediaUserRepository = mediaUserRepository;
        this.mediaUserHistoryRepository = mediaUserHistoryRepository;
        this.mediaUserHistoryMapper = mediaUserHistoryMapper;
    }

    public void recalcAggregates(MediaUser mu) {
        Long mediaUserId = mu.getId();

        long count = mediaUserHistoryRepository.countByMediaUserId(mediaUserId);
        LocalDate min = mediaUserHistoryRepository.minEventDate(mediaUserId);
        LocalDate max = mediaUserHistoryRepository.maxEventDate(mediaUserId);

        DatePrecision lastPrecision = mediaUserHistoryRepository
                .findFirstByMediaUserIdOrderByEventDateDescIdDesc(mediaUserId)
                .map(MediaUserHistory::getPrecision)
                .orElse(DatePrecision.DAY);

        mu.setHistoryCount((int) count);
        mu.setFirstEventDate(min);
        mu.setLastEventDate(max);
        mu.setLastEventPrecision(lastPrecision);
    }

    @Transactional
    public MediaUserHistoryResponse addHistory(Long userId, Long mediaId, MediaUserHistoryRequest request) {
        MediaUser mediaUser = mediaUserRepository.findByUserIdAndMediaId(userId, mediaId)
                .orElseThrow(() -> new NotFoundException("MEDIA_USER", "MediaUser", userId + " " + mediaId));

        DatePrecision precision = request.precision() != null ? DatePrecision.valueOf(request.precision()) : null;

        MediaUserHistory history = new MediaUserHistory();
        history.setMediaUser(mediaUser);
        history.setEventDate(request.eventDate());
        history.setPrecision(precision);

        history = mediaUserHistoryRepository.save(history);

        recalcAggregates(mediaUser);
        mediaUserRepository.save(mediaUser);

        return mediaUserHistoryMapper.toResponse(history);
    }

    @Transactional
    public MediaUserHistoryResponse updateHistory(Long userId, Long mediaId, Long historyId, MediaUserHistoryRequest request) {
        MediaUser mediaUser = mediaUserRepository.findByUserIdAndMediaId(userId, mediaId)
                .orElseThrow(() -> new NotFoundException("MEDIA_USER", "MediaUser", userId + " " + mediaId));

        MediaUserHistory history = mediaUserHistoryRepository.findByIdAndMediaUserId(historyId, mediaUser.getId())
                .orElseThrow(() -> new NotFoundException("MEDIA_USER_HISTORY", "MediaUserHistory", historyId.toString()));

        DatePrecision precision = request.precision() != null ? DatePrecision.valueOf(request.precision()) : null;

        history.setEventDate(request.eventDate());
        history.setPrecision(precision);

        history = mediaUserHistoryRepository.save(history);

        recalcAggregates(mediaUser);
        mediaUserRepository.save(mediaUser);

        return mediaUserHistoryMapper.toResponse(history);
    }

    @Transactional
    public void deleteHistory(Long userId, Long mediaId, Long historyId) {
        MediaUser mediaUser = mediaUserRepository.findByUserIdAndMediaId(userId, mediaId)
                .orElseThrow(() -> new NotFoundException("MEDIA_USER", "MediaUser", userId + " " + mediaId));

        int deleted = mediaUserHistoryRepository.deleteByIdAndMediaUserId(historyId, mediaUser.getId());
        if (deleted == 0) {
            throw new NotFoundException("MEDIA_USER_HISTORY", "MediaUserHistory", historyId.toString());
        }

        recalcAggregates(mediaUser);
        mediaUserRepository.save(mediaUser);
    }
}
