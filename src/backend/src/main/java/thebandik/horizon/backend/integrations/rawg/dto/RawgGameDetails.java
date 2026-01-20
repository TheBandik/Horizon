package thebandik.horizon.backend.integrations.rawg.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record RawgGameDetails(
        long id,
        String name,
        @JsonProperty("name_original") String nameOriginal,
        String released,
        @JsonProperty("background_image") String backgroundImage
) {
}
