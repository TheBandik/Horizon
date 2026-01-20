package thebandik.horizon.backend.integrations.rawg;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import thebandik.horizon.backend.media.dto.MediaResponse;

@RestController
@RequestMapping("/api/external/rawg")
@RequiredArgsConstructor
public class RawgImportController {

    private final RawgImportService importService;

    @PostMapping("/import")
    public MediaResponse importGame(@RequestBody ImportRequest request) {
        var media = importService.importGame(request.externalId());
        return MediaResponse.from(media);
    }

    public record ImportRequest(String externalId) {
    }
}
