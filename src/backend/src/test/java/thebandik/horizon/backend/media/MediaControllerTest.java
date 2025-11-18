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
import thebandik.horizon.backend.media.dto.MediaRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class MediaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MediaRepository mediaRepository;

    @Autowired
    private MediaTypeRepository mediaTypeRepository;

    @BeforeEach
    void setUp() {
        mediaRepository.deleteAll();
        mediaTypeRepository.deleteAll();
    }

    @Test
    void create_shouldReturn201_whenMediaIsValid() throws Exception {
        MediaTypeEntity mediaType = mediaTypeRepository.save(new MediaTypeEntity(null, "Movie"));

        MediaRequest request = new MediaRequest(
                "Title",
                "Original Title",
                LocalDate.parse("2025-10-10"),
                mediaType.getId()
        );

        mockMvc.perform(post("/api/media")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void getAll_shouldReturn200_whenMediaExist() throws Exception {
        MediaTypeEntity mediaType = mediaTypeRepository.save(new MediaTypeEntity(null, "Movie"));

        mediaRepository.save(new Media(
                null,
                "Title",
                "Original Title",
                "https://**",
                LocalDate.parse("2025-10-10"),
                mediaType,
                LocalDateTime.parse("2025-12-03T10:15:30"),
                LocalDateTime.parse("2025-12-03T10:15:30")
        ));

        mediaRepository.save(new Media(
                null,
                "Title",
                "Original Title",
                "https://**",
                LocalDate.parse("2025-10-10"),
                mediaType,
                LocalDateTime.parse("2025-12-03T10:15:30"),
                LocalDateTime.parse("2025-12-03T10:15:30")
        ));

        mockMvc.perform(get("/api/media")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void getById_shouldReturn200_whenMediaExists() throws Exception {
        MediaTypeEntity mediaType = mediaTypeRepository.save(new MediaTypeEntity(null, "Movie"));

        Media saved = mediaRepository.save(new Media(
                null,
                "Title",
                "Original Title",
                "https://**",
                LocalDate.parse("2025-10-10"),
                mediaType,
                LocalDateTime.parse("2025-12-03T10:15:30"),
                LocalDateTime.parse("2025-12-03T10:15:30")
        ));

        mockMvc.perform(get("/api/media/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void update_shouldReturn200_whenMediaIsValid() throws Exception {
        MediaTypeEntity mediaType = mediaTypeRepository.save(new MediaTypeEntity(null, "Movie"));

        Media saved = mediaRepository.save(new Media(
                null,
                "Title",
                "Original Title",
                "https://**",
                LocalDate.parse("2025-10-10"),
                mediaType,
                LocalDateTime.parse("2025-12-03T10:15:30"),
                LocalDateTime.parse("2025-12-03T10:15:30")
        ));

        MediaRequest request = new MediaRequest(
                "New Title",
                "New Original Title",
                LocalDate.parse("2024-10-10"),
                mediaType.getId()
        );

        mockMvc.perform(put("/api/media/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void delete_shouldReturn204_whenMediaExists() throws Exception {
        MediaTypeEntity mediaType = mediaTypeRepository.save(new MediaTypeEntity(null, "Movie"));

        Media saved = mediaRepository.save(new Media(
                null,
                "Title",
                "Original Title",
                "https://**",
                LocalDate.parse("2025-10-10"),
                mediaType,
                LocalDateTime.parse("2025-12-03T10:15:30"),
                LocalDateTime.parse("2025-12-03T10:15:30")
        ));

        mockMvc.perform(delete("/api/media/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void getById_shouldReturn404_whenMediaNotFound() throws Exception {
        mockMvc.perform(get("/api/media/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void update_shouldReturn404_whenMediaNotFound() throws Exception {
        MediaTypeEntity mediaType = mediaTypeRepository.save(new MediaTypeEntity(null, "Movie"));

        MediaRequest request = new MediaRequest(
                "New Title",
                "New Original Title",
                LocalDate.parse("2024-10-10"),
                mediaType.getId()
        );

        mockMvc.perform(put("/api/media/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_shouldReturn404_whenMediaNotFound() throws Exception {
        mockMvc.perform(delete("/api/media/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
