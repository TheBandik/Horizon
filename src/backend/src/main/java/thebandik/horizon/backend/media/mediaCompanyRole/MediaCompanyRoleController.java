package thebandik.horizon.backend.media.mediaCompanyRole;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import thebandik.horizon.backend.media.mediaCompanyRole.dto.MediaCompanyRoleRequest;
import thebandik.horizon.backend.media.mediaCompanyRole.dto.MediaCompanyRoleResponse;

@RestController
@RequestMapping("/api/media-company-role")
public class MediaCompanyRoleController {

    private final MediaCompanyRoleService mediaCompanyRoleService;

    public MediaCompanyRoleController(MediaCompanyRoleService mediaCompanyRoleService) {
        this.mediaCompanyRoleService = mediaCompanyRoleService;
    }

    @PostMapping
    public ResponseEntity<MediaCompanyRoleResponse> create(@RequestBody MediaCompanyRoleRequest request) {
        MediaCompanyRole mediaCompanyRole = mediaCompanyRoleService.create(request);

        MediaCompanyRoleResponse response = new MediaCompanyRoleResponse(
                mediaCompanyRole.getId(),
                mediaCompanyRole.getMedia().getId(),
                mediaCompanyRole.getCompany().getId(),
                mediaCompanyRole.getRole().getId()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
