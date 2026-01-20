package thebandik.horizon.backend.search;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import thebandik.horizon.backend.search.dto.MixedMediaSearchResponse;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class MixedSearchController {

    private final MixedMediaSearchService service;

    @GetMapping("/media")
    public MixedMediaSearchResponse searchMedia(
            @RequestParam String q,
            @RequestParam Long mediaTypeId
    ) {
        return service.search(q, mediaTypeId);
    }
}
