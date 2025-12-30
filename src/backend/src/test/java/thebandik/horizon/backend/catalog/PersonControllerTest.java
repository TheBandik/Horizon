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
import thebandik.horizon.backend.catalog.person.Person;
import thebandik.horizon.backend.catalog.person.PersonRepository;
import thebandik.horizon.backend.catalog.person.dto.PersonRequest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
class PersonControllerTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PersonRepository personRepository;

    @Test
    void create_shouldReturn201_whenPersonIsValid() throws Exception {
        PersonRequest request = new PersonRequest("Alex Gordon");

        mockMvc.perform(post("/api/person")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void getAll_shouldReturn200_whenPersonExist() throws Exception {
        personRepository.save(new Person(null, "Alex Gordon"));
        personRepository.save(new Person(null, "Debby Laysan"));

        mockMvc.perform(get("/api/person")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void getById_shouldReturn200_whenPersonExists() throws Exception {
        Person saved = personRepository.save(new Person(null, "Alex Gordon"));

        mockMvc.perform(get("/api/person/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void update_shouldReturn200_whenPersonIsValid() throws Exception {
        Person saved = personRepository.save(new Person(null, "Alex Gordon"));

        PersonRequest request = new PersonRequest("Debby Laysan");

        mockMvc.perform(put("/api/person/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void delete_shouldReturn204_whenPersonExists() throws Exception {
        Person saved = personRepository.save(new Person(null, "Alex Gordon"));

        mockMvc.perform(delete("/api/person/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void create_shouldReturn409_whenNameAlreadyExists() throws Exception {
        PersonRequest first = new PersonRequest("Alex Gordon");
        PersonRequest second = new PersonRequest("Alex Gordon");

        // Первая — ок
        mockMvc.perform(post("/api/person")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(first)))
                .andExpect(status().isCreated());

        // Вторая — конфликт по name
        mockMvc.perform(post("/api/person")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(second)))
                .andExpect(status().isConflict());
    }

    @Test
    void getById_shouldReturn404_whenPersonNotFound() throws Exception {
        mockMvc.perform(get("/api/person/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void update_shouldReturn404_whenPersonNotFound() throws Exception {
        PersonRequest request = new PersonRequest("Alex Gordon");

        mockMvc.perform(put("/api/person/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_shouldReturn404_whenPersonNotFound() throws Exception {
        mockMvc.perform(delete("/api/person/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
