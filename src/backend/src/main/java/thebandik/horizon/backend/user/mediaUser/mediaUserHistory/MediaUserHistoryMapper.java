package thebandik.horizon.backend.user.mediaUser.mediaUserHistory;

import org.springframework.stereotype.Component;
import thebandik.horizon.backend.user.mediaUser.mediaUserHistory.dto.MediaUserHistoryResponse;

@Component
public class MediaUserHistoryMapper {
    public MediaUserHistoryResponse toResponse(MediaUserHistory history) {
        return new MediaUserHistoryResponse(
                history.getId(),
                history.getEventDate(),
                history.getPrecision() != null ? history.getPrecision().name() : null);
    }
}
