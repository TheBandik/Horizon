package thebandik.horizon.backend.catalog;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import thebandik.horizon.backend.catalog.role.Role;
import thebandik.horizon.backend.catalog.role.RoleRepository;
import thebandik.horizon.backend.catalog.role.dto.RoleRequest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class RoleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RoleRepository roleRepository;

    @BeforeEach
    void setUp() {
        roleRepository.deleteAll();
    }

    @Test
    void create_shouldReturn201_whenRoleIsValid() throws Exception {
        RoleRequest request = new RoleRequest("Developer");

        mockMvc.perform(post("/api/role")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void getAll_shouldReturn200_whenRoleExist() throws Exception {
        roleRepository.save(new Role(null, "Developer"));
        roleRepository.save(new Role(null, "Producer"));

        mockMvc.perform(get("/api/role")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void getById_shouldReturn200_whenRoleExists() throws Exception {
        Role saved = roleRepository.save(new Role(null, "Developer"));

        mockMvc.perform(get("/api/role/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void update_shouldReturn200_whenRoleIsValid() throws Exception {
        Role saved = roleRepository.save(new Role(null, "Developer"));

        RoleRequest request = new RoleRequest("Producer");

        mockMvc.perform(put("/api/role/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void delete_shouldReturn204_whenRoleExists() throws Exception {
        Role saved = roleRepository.save(new Role(null, "Developer"));

        mockMvc.perform(delete("/api/role/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void create_shouldReturn409_whenNameAlreadyExists() throws Exception {
        RoleRequest first = new RoleRequest("Developer");
        RoleRequest second = new RoleRequest("Developer");

        // Первая — ок
        mockMvc.perform(post("/api/role")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(first)))
                .andExpect(status().isCreated());

        // Вторая — конфликт по name
        mockMvc.perform(post("/api/role")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(second)))
                .andExpect(status().isConflict());
    }

    @Test
    void getById_shouldReturn404_whenRoleNotFound() throws Exception {
        mockMvc.perform(get("/api/role/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void update_shouldReturn404_whenRoleNotFound() throws Exception {
        RoleRequest request = new RoleRequest("Developer");

        mockMvc.perform(put("/api/role/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_shouldReturn404_whenRoleNotFound() throws Exception {
        mockMvc.perform(delete("/api/role/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
