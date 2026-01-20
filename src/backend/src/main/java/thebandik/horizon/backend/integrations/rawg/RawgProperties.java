package thebandik.horizon.backend.integrations.rawg;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "integrations.rawg")
public record RawgProperties(
        String baseUrl,
        String apiKey
) {
}
