package thebandik.horizon.backend.user.mediaUser;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import thebandik.horizon.backend.user.mediaUser.dto.MediaUserCreateRequest;
import thebandik.horizon.backend.user.mediaUser.dto.MediaUserResponse;

@RestController
@RequestMapping("/api/media-user")
public class MediaUserController {

    private final MediaUserService mediaUserService;

    public MediaUserController(MediaUserService mediaUserService) {
        this.mediaUserService = mediaUserService;
    }

    @PostMapping
    public ResponseEntity<MediaUserResponse> create(@RequestBody MediaUserCreateRequest request) {
        MediaUser mediaUser = mediaUserService.create(request);

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
}
