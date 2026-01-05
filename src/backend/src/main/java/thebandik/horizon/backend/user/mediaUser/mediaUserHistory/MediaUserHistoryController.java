package thebandik.horizon.backend.user.mediaUser.mediaUserHistory;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import thebandik.horizon.backend.common.CurrentUser;
import thebandik.horizon.backend.user.mediaUser.mediaUserHistory.dto.MediaUserHistoryRequest;
import thebandik.horizon.backend.user.mediaUser.mediaUserHistory.dto.MediaUserHistoryResponse;

@RestController
@RequestMapping("/api/media-user/{mediaId}/history")
public class MediaUserHistoryController {

    private final MediaUserHistoryService mediaUserHistoryService;

    public MediaUserHistoryController(MediaUserHistoryService mediaUserHistoryService) {
        this.mediaUserHistoryService = mediaUserHistoryService;
    }

    @PostMapping
    public MediaUserHistoryResponse add(
            @PathVariable Long mediaId,
            @RequestBody MediaUserHistoryRequest request,
            @CurrentUser Long userId) {
        return mediaUserHistoryService.addHistory(userId, mediaId, request);
    }

    @PutMapping("/{historyId}")
    public MediaUserHistoryResponse update(
            @PathVariable Long mediaId,
            @PathVariable Long historyId,
            @RequestBody MediaUserHistoryRequest request,
            @CurrentUser Long userId
    ) {
        return mediaUserHistoryService.updateHistory(userId, mediaId, historyId, request);
    }

    @DeleteMapping("/{historyId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long mediaId, @PathVariable Long historyId, @CurrentUser Long userId) {
        mediaUserHistoryService.deleteHistory(userId, mediaId, historyId);
    }
}
