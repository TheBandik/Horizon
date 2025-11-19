package thebandik.horizon.backend.catalog;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import thebandik.horizon.backend.catalog.status.Status;
import thebandik.horizon.backend.catalog.status.StatusRepository;
import thebandik.horizon.backend.catalog.status.dto.StatusRequest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class StatusControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private StatusRepository statusRepository;

    @BeforeEach
    void setUp() {
        statusRepository.deleteAll();
    }

    @Test
    void create_shouldReturn201_whenStatusIsValid() throws Exception {
        StatusRequest request = new StatusRequest("Wacthed");

        mockMvc.perform(post("/api/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void getAll_shouldReturn200_whenStatusExist() throws Exception {
        statusRepository.save(new Status(null, "Watched"));
        statusRepository.save(new Status(null, "Played"));

        mockMvc.perform(get("/api/status")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void getById_shouldReturn200_whenStatusExists() throws Exception {
        Status saved = statusRepository.save(new Status(null, "Watched"));

        mockMvc.perform(get("/api/status/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void update_shouldReturn200_whenStatusIsValid() throws Exception {
        Status saved = statusRepository.save(new Status(null, "Watched"));

        StatusRequest request = new StatusRequest("Played");

        mockMvc.perform(put("/api/status/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void delete_shouldReturn204_whenStatusExists() throws Exception {
        Status saved = statusRepository.save(new Status(null, "Watched"));

        mockMvc.perform(delete("/api/status/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void create_shouldReturn409_whenNameAlreadyExists() throws Exception {
        StatusRequest first = new StatusRequest("Watched");
        StatusRequest second = new StatusRequest("Watched");

        // Первая — ок
        mockMvc.perform(post("/api/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(first)))
                .andExpect(status().isCreated());

        // Вторая — конфликт по name
        mockMvc.perform(post("/api/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(second)))
                .andExpect(status().isConflict());
    }

    @Test
    void getById_shouldReturn404_whenStatusNotFound() throws Exception {
        mockMvc.perform(get("/api/status/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void update_shouldReturn404_whenStatusNotFound() throws Exception {
        StatusRequest request = new StatusRequest("Watched");

        mockMvc.perform(put("/api/status/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_shouldReturn404_whenStatusNotFound() throws Exception {
        mockMvc.perform(delete("/api/status/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
