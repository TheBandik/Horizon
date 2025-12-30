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
import thebandik.horizon.backend.catalog.genre.Genre;
import thebandik.horizon.backend.catalog.genre.GenreRepository;
import thebandik.horizon.backend.catalog.genre.dto.GenreRequest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
class GenreControllerTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private GenreRepository genreRepository;

    @Test
    void create_shouldReturn201_whenGenreIsValid() throws Exception {
        GenreRequest request = new GenreRequest("Test-Action");

        mockMvc.perform(post("/api/genre")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void getAll_shouldReturn200_whenGenreExist() throws Exception {
        genreRepository.save(new Genre(null, "Test-Action"));
        genreRepository.save(new Genre(null, "Test-RPG"));

        mockMvc.perform(get("/api/genre")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void getById_shouldReturn200_whenGenreExists() throws Exception {
        Genre saved = genreRepository.save(new Genre(null, "Test-Action"));

        mockMvc.perform(get("/api/genre/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void update_shouldReturn200_whenGenreIsValid() throws Exception {
        Genre saved = genreRepository.save(new Genre(null, "Test-Action"));

        GenreRequest request = new GenreRequest("Test-RPG");

        mockMvc.perform(put("/api/genre/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void delete_shouldReturn204_whenGenreExists() throws Exception {
        Genre saved = genreRepository.save(new Genre(null, "Test-Action"));

        mockMvc.perform(delete("/api/genre/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void create_shouldReturn409_whenNameAlreadyExists() throws Exception {
        GenreRequest first = new GenreRequest("Test-Action");
        GenreRequest second = new GenreRequest("Test-Action");

        // Первая — ок
        mockMvc.perform(post("/api/genre")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(first)))
                .andExpect(status().isCreated());

        // Вторая — конфликт по name
        mockMvc.perform(post("/api/genre")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(second)))
                .andExpect(status().isConflict());
    }

    @Test
    void getById_shouldReturn404_whenGenreNotFound() throws Exception {
        mockMvc.perform(get("/api/genre/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void update_shouldReturn404_whenGenreNotFound() throws Exception {
        GenreRequest request = new GenreRequest("Test-Action");

        mockMvc.perform(put("/api/genre/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_shouldReturn404_whenGenreNotFound() throws Exception {
        mockMvc.perform(delete("/api/genre/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
