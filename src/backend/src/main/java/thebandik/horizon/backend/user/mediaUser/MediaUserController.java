package thebandik.horizon.backend.user.mediaUser;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import thebandik.horizon.backend.common.CurrentUser;
import thebandik.horizon.backend.user.mediaUser.dto.*;

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
    public MediaUserResponse create(
            @RequestBody MediaUserRequest request,
            @CurrentUser Long userId
    ) {
        return mediaUserService.create(request, userId);
    }

    @GetMapping
    public List<MediaUserGetByMediaTypeResponse> getMediaUserByMediaType(
            @RequestParam Long mediaTypeId,
            @CurrentUser Long userId
    ) {
        return mediaUserService.getMediaUserByMediaType(mediaTypeId, userId);
    }

    @GetMapping("/{mediaId}")
    public MediaUserDetailsResponse getDetails(@PathVariable Long mediaId, @CurrentUser Long userId) {
        return mediaUserService.getDetails(userId, mediaId);
    }

    @PutMapping("/{mediaId}")
    public MediaUserResponse updateCard(
            @PathVariable Long mediaId,
            @RequestBody MediaUserUpdateRequest request,
            @CurrentUser Long userId
    ) {
        return mediaUserService.updateCard(userId, mediaId, request);
    }

    @DeleteMapping("/{mediaId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long mediaId, @CurrentUser Long userId) {
        mediaUserService.delete(userId, mediaId);
    }
}
