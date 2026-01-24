package thebandik.horizon.backend.user;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserPreferencesService {

    private final UserPreferencesRepository userPreferencesRepository;
    private final ObjectMapper objectMapper;

    public UserPreferencesService(
            UserPreferencesRepository userPreferencesRepository,
            ObjectMapper objectMapper
    ) {
        this.userPreferencesRepository = userPreferencesRepository;
        this.objectMapper = objectMapper;
    }

    public Map<String, Object> getPrefs(long userId) {
        return userPreferencesRepository.findById(userId)
                .map(e -> readJson(e.getPrefsJson()))
                .orElse(Map.of());
    }

    @Transactional
    public Map<String, Object> patchPrefs(long userId, Map<String, Object> patch) {
        var entity = userPreferencesRepository.findById(userId).orElseGet(() -> {
            var e = new UserPreferences();
            e.setUserId(userId);
            e.setPrefsJson("{}");
            return e;
        });

        var base = readJson(entity.getPrefsJson());
        var merged = deepMerge(base, patch);

        entity.setPrefsJson(writeJson(merged));
        userPreferencesRepository.save(entity);

        return merged;
    }

    private Map<String, Object> readJson(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<>() {
            });
        } catch (Exception e) {
            return new HashMap<>();
        }
    }

    private String writeJson(Map<String, Object> map) {
        try {
            return objectMapper.writeValueAsString(map);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize preferences", e);
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> deepMerge(
            Map<String, Object> base,
            Map<String, Object> patch
    ) {
        for (var entry : patch.entrySet()) {
            var key = entry.getKey();
            var patchVal = entry.getValue();

            if (patchVal instanceof Map<?, ?> patchMap
                    && base.get(key) instanceof Map<?, ?> baseMap) {

                base.put(key, deepMerge(
                        new HashMap<>((Map<String, Object>) baseMap),
                        (Map<String, Object>) patchMap
                ));
            } else {
                base.put(key, patchVal);
            }
        }
        return base;
    }
}
