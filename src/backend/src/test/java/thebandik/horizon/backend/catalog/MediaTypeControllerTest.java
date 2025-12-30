package thebandik.horizon.backend.catalog;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import thebandik.horizon.backend.BaseIntegrationTest;
import thebandik.horizon.backend.catalog.mediaType.MediaTypeEntity;
import thebandik.horizon.backend.catalog.mediaType.MediaTypeRepository;
import thebandik.horizon.backend.catalog.mediaType.dto.MediaTypeRequest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
class MediaTypeControllerTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MediaTypeRepository mediaTypeRepository;

    @Test
    void create_shouldReturn201_whenMediaTypeIsValid() throws Exception {
        MediaTypeRequest request = new MediaTypeRequest("Test");

        mockMvc.perform(post("/api/media-types")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void getAll_shouldReturn200_whenMediaTypesExist() throws Exception {
        mediaTypeRepository.save(new MediaTypeEntity(null, "Test"));
        mediaTypeRepository.save(new MediaTypeEntity(null, "Test2"));

        mockMvc.perform(get("/api/media-types")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void getById_shouldReturn200_whenMediaTypeExists() throws Exception {
        MediaTypeEntity saved = mediaTypeRepository.save(new MediaTypeEntity(null, "Test"));

        mockMvc.perform(get("/api/media-types/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void update_shouldReturn200_whenMediaTypeIsValid() throws Exception {
        MediaTypeEntity saved = mediaTypeRepository.save(new MediaTypeEntity(null, "Test"));

        MediaTypeRequest request = new MediaTypeRequest("Film");

        mockMvc.perform(put("/api/media-types/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void delete_shouldReturn204_whenMediaTypeExists() throws Exception {
        MediaTypeEntity saved = mediaTypeRepository.save(new MediaTypeEntity(null, "Test"));

        mockMvc.perform(delete("/api/media-types/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void create_shouldReturn409_whenNameAlreadyExists() throws Exception {
        MediaTypeRequest first = new MediaTypeRequest("Test");
        MediaTypeRequest second = new MediaTypeRequest("Test");

        // Первая — ок
        mockMvc.perform(post("/api/media-types")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(first)))
                .andExpect(status().isCreated());

        // Вторая — конфликт по name
        mockMvc.perform(post("/api/media-types")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(second)))
                .andExpect(status().isConflict());
    }

    @Test
    void getById_shouldReturn404_whenMediaTypeNotFound() throws Exception {
        mockMvc.perform(get("/api/media-types/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void update_shouldReturn404_whenMediaTypeNotFound() throws Exception {
        MediaTypeRequest request = new MediaTypeRequest("Film");

        mockMvc.perform(put("/api/media-types/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_shouldReturn404_whenMediaTypeNotFound() throws Exception {
        mockMvc.perform(delete("/api/media-types/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
