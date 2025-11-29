package thebandik.horizon.backend.catalog;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import thebandik.horizon.backend.catalog.series.Series;
import thebandik.horizon.backend.catalog.series.SeriesRepository;
import thebandik.horizon.backend.catalog.series.dto.SeriesRequest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class SeriesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SeriesRepository seriesRepository;
    private Series parent;

    @BeforeEach
    void setUp() {
        seriesRepository.deleteAll();
        parent = seriesRepository.save(new Series(null, "Parent", null));
    }

    @Test
    void create_shouldReturn201_whenSeriesIsValid() throws Exception {
        SeriesRequest request = new SeriesRequest("Star Wars", parent.getId());

        mockMvc.perform(post("/api/series")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void getAll_shouldReturn200_whenSeriesExist() throws Exception {
        seriesRepository.save(new Series(null, "Star Wars", parent));
        seriesRepository.save(new Series(null, "Halo", null));

        mockMvc.perform(get("/api/series")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void getById_shouldReturn200_whenSeriesExists() throws Exception {
        Series saved = seriesRepository.save(new Series(null, "Star Wars", null));

        mockMvc.perform(get("/api/series/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void update_shouldReturn200_whenSeriesIsValid() throws Exception {
        Series saved = seriesRepository.save(new Series(null, "Star Wars", parent));

        SeriesRequest request = new SeriesRequest("Halo", null);

        mockMvc.perform(put("/api/series/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void delete_shouldReturn204_whenSeriesExists() throws Exception {
        Series saved = seriesRepository.save(new Series(null, "Star Wars", parent));

        mockMvc.perform(delete("/api/series/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void create_shouldReturn409_whenNameAlreadyExists() throws Exception {
        SeriesRequest first = new SeriesRequest("Star Wars", null);
        SeriesRequest second = new SeriesRequest("Star Wars", parent.getId());

        // Первая — ок
        mockMvc.perform(post("/api/series")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(first)))
                .andExpect(status().isCreated());

        // Вторая — конфликт по name
        mockMvc.perform(post("/api/series")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(second)))
                .andExpect(status().isConflict());
    }

    @Test
    void getById_shouldReturn404_whenSeriesNotFound() throws Exception {
        mockMvc.perform(get("/api/series/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void update_shouldReturn404_whenSeriesNotFound() throws Exception {
        SeriesRequest request = new SeriesRequest("Star Wars", parent.getId());

        mockMvc.perform(put("/api/series/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_shouldReturn404_whenSeriesNotFound() throws Exception {
        mockMvc.perform(delete("/api/series/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
