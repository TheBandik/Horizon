package thebandik.horizon.backend.user.mediaUser;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thebandik.horizon.backend.common.CurrentUser;
import thebandik.horizon.backend.user.mediaUser.dto.MediaUserCreateRequest;
import thebandik.horizon.backend.user.mediaUser.dto.MediaUserGetByMediaTypeResponse;
import thebandik.horizon.backend.user.mediaUser.dto.MediaUserResponse;

import java.util.List;

@RestController
@RequestMapping("/api/media-user")
public class MediaUserController {

    private final MediaUserService mediaUserService;

    public MediaUserController(
            MediaUserService mediaUserService
    ) {
        this.mediaUserService = mediaUserService;
    }

    @PostMapping
    public ResponseEntity<MediaUserResponse> create(
            @RequestBody MediaUserCreateRequest request,
            @CurrentUser Long userId
    ) {
        MediaUser mediaUser = mediaUserService.create(request, userId);

        MediaUserResponse response = new MediaUserResponse(
                mediaUser.getId(),
                mediaUser.getMedia().getId(),
                mediaUser.getUser().getId(),
                mediaUser.getStatus().getId(),
                mediaUser.getRating(),
                mediaUser.getFirstEventDate(),
                mediaUser.getLastEventDate(),
                mediaUser.getHistoryCount()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<MediaUserGetByMediaTypeResponse> getMediaUserByMediaType(
            @RequestParam Long mediaTypeId,
            @CurrentUser Long userId
    ) {
        return mediaUserService.getMediaUserByMediaType(mediaTypeId, userId);
    }

    @DeleteMapping("/{mediaId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long mediaId, @CurrentUser Long userId) {
        mediaUserService.delete(userId, mediaId);
    }
}
