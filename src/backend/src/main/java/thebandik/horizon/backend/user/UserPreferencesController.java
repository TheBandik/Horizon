package thebandik.horizon.backend.user;

import org.springframework.web.bind.annotation.*;
import thebandik.horizon.backend.common.CurrentUser;

import java.util.Map;

@RestController
@RequestMapping("/api/user/preferences")
public class UserPreferencesController {

    private final UserPreferencesService service;

    public UserPreferencesController(UserPreferencesService service) {
        this.service = service;
    }

    @GetMapping
    public Map<String, Object> getPrefs(@CurrentUser Long userId) {
        return service.getPrefs(userId);
    }

    @PatchMapping
    public Map<String, Object> patchPrefs(
            @CurrentUser Long userId,
            @RequestBody Map<String, Object> patch
    ) {
        return service.patchPrefs(userId, patch);
    }
}
