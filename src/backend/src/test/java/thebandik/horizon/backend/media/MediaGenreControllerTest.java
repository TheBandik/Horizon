package thebandik.horizon.backend.media;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import thebandik.horizon.backend.BaseIntegrationTest;
import thebandik.horizon.backend.catalog.genre.Genre;
import thebandik.horizon.backend.catalog.genre.GenreRepository;
import thebandik.horizon.backend.catalog.mediaType.MediaTypeEntity;
import thebandik.horizon.backend.catalog.mediaType.MediaTypeRepository;
import thebandik.horizon.backend.media.mediaGenre.MediaGenreRepository;
import thebandik.horizon.backend.media.mediaGenre.MediaGenre;
import thebandik.horizon.backend.media.mediaGenre.dto.MediaGenreRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
public class MediaGenreControllerTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MediaRepository mediaRepository;

    @Autowired
    private MediaTypeRepository mediaTypeRepository;

    @Autowired
    private GenreRepository genreRepository;

    @Autowired
    private MediaGenreRepository mediaGenreRepository;

    @Test
    void create_shouldReturn201_whenMediaGenreIsValid() throws Exception {
        MediaTypeEntity mediaType = mediaTypeRepository.save(new MediaTypeEntity(null, "Test"));
        Genre genre = genreRepository.save(new Genre(null, "Action"));
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

        MediaGenreRequest request = new MediaGenreRequest(
                media.getId(),
                genre.getId()
        );

        mockMvc.perform(post("/api/media-genre")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void getGenreByMediaId_shouldReturn200_whenMediaGenreExists() throws Exception {
        MediaTypeEntity mediaType = mediaTypeRepository.save(new MediaTypeEntity(null, "Test"));
        Genre genreFirst = genreRepository.save(new Genre(null, "Action"));
        Genre genreSecond = genreRepository.save(new Genre(null, "RPG"));
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

        mediaGenreRepository.save(new MediaGenre(null, media, genreFirst));
        mediaGenreRepository.save(new MediaGenre(null, media, genreSecond));

        mockMvc.perform(get("/api/media-genre/{mediaId}/genres", media.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
