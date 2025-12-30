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
import thebandik.horizon.backend.catalog.status.Status;
import thebandik.horizon.backend.catalog.status.StatusRepository;
import thebandik.horizon.backend.catalog.status.dto.StatusRequest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
class StatusControllerTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private StatusRepository statusRepository;

    @Test
    void create_shouldReturn201_whenStatusIsValid() throws Exception {
        StatusRequest request = new StatusRequest("Wacthed", "TEST", "ALL");

        mockMvc.perform(post("/api/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void getAll_shouldReturn200_whenStatusExist() throws Exception {
        statusRepository.save(new Status(null, "Test", "TEST", "ALL"));
        statusRepository.save(new Status(null, "Test2", "TEST2", "ALL"));

        mockMvc.perform(get("/api/status")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void getById_shouldReturn200_whenStatusExists() throws Exception {
        Status saved = statusRepository.save(new Status(null, "Test", "TEST", "ALL"));

        mockMvc.perform(get("/api/status/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void delete_shouldReturn204_whenStatusExists() throws Exception {
        Status saved = statusRepository.save(new Status(null, "Test", "TEST", "ALL"));

        mockMvc.perform(delete("/api/status/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void create_shouldReturn409_whenNameAlreadyExists() throws Exception {
        StatusRequest first = new StatusRequest("Test", "TEST", "ALL");
        StatusRequest second = new StatusRequest("Test", "TEST", "ALL");

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
    void delete_shouldReturn404_whenStatusNotFound() throws Exception {
        mockMvc.perform(delete("/api/status/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
