package thebandik.horizon.backend.integrations.rawg.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record RawgSearchResponse(
        List<RawgGameShort> results
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record RawgGameShort(
            long id,
            String name,
            String released,
            @JsonProperty("background_image") String backgroundImage
    ) {
    }
}
