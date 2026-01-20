package thebandik.horizon.backend.integrations.rawg;

import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import thebandik.horizon.backend.integrations.rawg.dto.RawgGameDetails;
import thebandik.horizon.backend.integrations.rawg.dto.RawgSearchResponse;

import java.time.Duration;

@Component
public class RawgClient {

    private final RestClient restClient;
    private final RawgProperties props;

    public RawgClient(RawgProperties props) {
        this.props = props;

        var requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout((int) Duration.ofSeconds(5).toMillis());
        requestFactory.setReadTimeout((int) Duration.ofSeconds(10).toMillis());

        this.restClient = RestClient.builder()
                .baseUrl(props.baseUrl())
                .requestFactory(requestFactory)
                .build();
    }

    public RawgSearchResponse searchGames(String query, int page, int pageSize) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/games")
                        .queryParam("key", props.apiKey())
                        .queryParam("search", query)
                        .queryParam("page", page)
                        .queryParam("page_size", pageSize)
                        .build())
                .retrieve()
                .body(RawgSearchResponse.class);
    }

    public RawgGameDetails getGameDetails(long rawgId) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/games/{id}")
                        .queryParam("key", props.apiKey())
                        .build(rawgId))
                .retrieve()
                .body(RawgGameDetails.class);
    }
}
