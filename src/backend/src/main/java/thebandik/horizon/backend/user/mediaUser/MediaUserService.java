package thebandik.horizon.backend.user.mediaUser;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import thebandik.horizon.backend.catalog.status.Status;
import thebandik.horizon.backend.catalog.status.StatusRepository;
import thebandik.horizon.backend.common.errors.NotFoundException;
import thebandik.horizon.backend.media.Media;
import thebandik.horizon.backend.media.MediaRepository;
import thebandik.horizon.backend.user.User;
import thebandik.horizon.backend.user.UserRepository;
import thebandik.horizon.backend.user.mediaUser.dto.*;
import thebandik.horizon.backend.user.mediaUser.mediaUserHistory.MediaUserHistory;
import thebandik.horizon.backend.user.mediaUser.mediaUserHistory.MediaUserHistoryRepository;
import thebandik.horizon.backend.user.mediaUser.mediaUserHistory.MediaUserHistoryService;
import thebandik.horizon.backend.user.mediaUser.mediaUserHistory.dto.MediaUserHistoryResponse;

import java.util.List;

@Slf4j
@Service
public class MediaUserService {

    private final MediaRepository mediaRepository;
    private final UserRepository userRepository;
    private final StatusRepository statusRepository;
    private final MediaUserRepository mediaUserRepository;
    private final MediaUserHistoryRepository mediaUserHistoryRepository;
    private final MediaUserMapper mediaUserMapper;
    private final MediaUserHistoryService mediaUserHistoryService;

    public MediaUserService(
            MediaRepository mediaRepository,
            UserRepository userRepository,
            StatusRepository statusRepository,
            MediaUserRepository mediaUserRepository,
            MediaUserHistoryRepository mediaUserHistoryRepository,
            MediaUserMapper mediaUserMapper,
            MediaUserHistoryService mediaUserHistoryService) {
        this.mediaRepository = mediaRepository;
        this.userRepository = userRepository;
        this.statusRepository = statusRepository;
        this.mediaUserRepository = mediaUserRepository;
        this.mediaUserHistoryRepository = mediaUserHistoryRepository;
        this.mediaUserMapper = mediaUserMapper;
        this.mediaUserHistoryService = mediaUserHistoryService;
    }

    @Transactional
    public MediaUserResponse create(MediaUserRequest request, Long userId) {
        Long mediaId = request.mediaId();
        Long statusId = request.statusId();

        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new NotFoundException("MEDIA", "Media", mediaId.toString()));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("USER", "User", userId.toString()));

        Status status = statusRepository.findById(statusId)
                .orElseThrow(() -> new NotFoundException("STATUS", "Status", statusId.toString()));

        MediaUser mediaUser = mediaUserRepository.findByUserIdAndMediaId(userId, mediaId)
                .orElseGet(() -> {
                    MediaUser mu = new MediaUser();
                    mu.setMedia(media);
                    mu.setUser(user);
                    mu.setHistoryCount(0);
                    return mu;
                });

        mediaUser.setStatus(status);
        mediaUser.setRating(request.rating());

        mediaUser = mediaUserRepository.save(mediaUser);

        if (request.eventDate() != null && request.precision() != null) {
            DatePrecision precision = DatePrecision.valueOf(request.precision());

            MediaUserHistory history = new MediaUserHistory();
            history.setMediaUser(mediaUser);
            history.setEventDate(request.eventDate());
            history.setPrecision(precision);
            mediaUserHistoryRepository.save(history);

            mediaUserHistoryService.recalcAggregates(mediaUser);
            mediaUser = mediaUserRepository.save(mediaUser);
        }

        return mediaUserMapper.toResponse(mediaUser);
    }


    public List<MediaUserGetByMediaTypeResponse> getMediaUserByMediaType(
            Long mediaTypeId,
            Long userId
    ) {
        return mediaUserRepository.findByUserIdAndMedia_MediaType_Id(userId, mediaTypeId).stream()
                .map(mediaUserMapper::getByMediaTypeToResponse)
                .toList();
    }

    @Transactional
    public void delete(Long userId, Long mediaId) {
        log.info("Delete media-user requested: userId = {}, mediaId = {}", userId, mediaId);

        try {
            int deleted = mediaUserRepository.deleteByUserIdAndMediaId(userId, mediaId);

            if (deleted == 0) {
                log.info("Media-user not found: userId = {}, mediaId = {}", userId, mediaId);
                return;
            }

            log.info("Media-user deleted: userId = {}, mediaId = {}", userId, mediaId);
        } catch (Exception e) {
            log.error("Failed to delete media-user: userId = {}, mediaId = {}", userId, mediaId, e);
            throw e;
        }
    }

    @Transactional
    public MediaUserResponse updateCard(Long userId, Long mediaId, MediaUserUpdateRequest request) {
        log.info("Update media-user card: userId={}, mediaId={}", userId, mediaId);

        MediaUser mediaUser = mediaUserRepository.findByUserIdAndMediaId(userId, mediaId)
                .orElseThrow(() -> new NotFoundException("MEDIA_USER", "MediaUser", userId + " " + mediaId));

        if (request.statusId() != null) {
            Status status = statusRepository.findById(request.statusId())
                    .orElseThrow(() -> new NotFoundException("STATUS", "Status", request.statusId().toString()));
            mediaUser.setStatus(status);
        }

        mediaUser.setRating(request.rating());

        var saved = mediaUserRepository.save(mediaUser);

        return mediaUserMapper.toResponse(saved);
    }

    @Transactional
    public MediaUserDetailsResponse getDetails(Long userId, Long mediaId) {
        log.info("Get media-user details requested: userId={}, mediaId={}", userId, mediaId);

        MediaUser mediaUser = mediaUserRepository.findByUserIdAndMediaId(userId, mediaId)
                .orElseThrow(() -> new NotFoundException("MEDIA_USER", "MediaUser", userId + " " + mediaId));

        var history = mediaUserHistoryRepository.findByMediaUserIdOrderByCreatedAtDesc(mediaUser.getId()).stream()
                .map(h -> new MediaUserHistoryResponse(
                        h.getId(),
                        h.getEventDate(),
                        h.getPrecision() != null ? h.getPrecision().name() : null
                ))
                .toList();

        return mediaUserMapper.detailsToResponse(mediaUser, history);
    }
}
