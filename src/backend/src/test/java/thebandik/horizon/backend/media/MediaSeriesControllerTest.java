package thebandik.horizon.backend.media;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import thebandik.horizon.backend.catalog.mediaType.MediaTypeEntity;
import thebandik.horizon.backend.catalog.mediaType.MediaTypeRepository;
import thebandik.horizon.backend.catalog.series.Series;
import thebandik.horizon.backend.catalog.series.SeriesRepository;
import thebandik.horizon.backend.media.mediaSeries.MediaSeries;
import thebandik.horizon.backend.media.mediaSeries.MediaSeriesRepository;
import thebandik.horizon.backend.media.mediaSeries.dto.MediaSeriesRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
public class MediaSeriesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MediaRepository mediaRepository;

    @Autowired
    private MediaTypeRepository mediaTypeRepository;

    @Autowired
    private SeriesRepository seriesRepository;

    @Autowired
    private MediaSeriesRepository mediaSeriesRepository;

    @BeforeEach
    void setUp() {
        mediaSeriesRepository.deleteAll();
        mediaRepository.deleteAll();
        seriesRepository.deleteAll();
        mediaTypeRepository.deleteAll();
    }

    @Test
    void create_shouldReturn201_whenMediaSeriesIsValid() throws Exception {
        MediaTypeEntity mediaType = mediaTypeRepository.save(new MediaTypeEntity(null, "Movie"));
        Series series = seriesRepository.save(new Series(null, "Star Wars", null));
        Media media = mediaRepository.save(new Media(
                null,
                "Title",
                "Original Title",
                "https://**",
                LocalDate.parse("2025-10-10"),
                mediaType,
                LocalDateTime.parse("2025-12-03T10:15:30"),
                LocalDateTime.parse("2025-12-03T10:15:30")
        ));

        MediaSeriesRequest request = new MediaSeriesRequest(
                media.getId(),
                series.getId()
        );

        mockMvc.perform(post("/api/media-series")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void getSeriesByMediaId_shouldReturn200_whenMediaSeriesExists() throws Exception {
        MediaTypeEntity mediaType = mediaTypeRepository.save(new MediaTypeEntity(null, "Movie"));
        Series seriesFirst = seriesRepository.save(new Series(null, "Star Wars", null));
        Series seriesSecond = seriesRepository.save(new Series(null, "Halo", null));
        Media media = mediaRepository.save(new Media(
                null,
                "Title",
                "Original Title",
                "https://**",
                LocalDate.parse("2025-10-10"),
                mediaType,
                LocalDateTime.parse("2025-12-03T10:15:30"),
                LocalDateTime.parse("2025-12-03T10:15:30")
        ));

        mediaSeriesRepository.save(new MediaSeries(null, media, seriesFirst));
        mediaSeriesRepository.save(new MediaSeries(null, media, seriesSecond));

        mockMvc.perform(get("/api/media-series/{mediaId}/series", media.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
