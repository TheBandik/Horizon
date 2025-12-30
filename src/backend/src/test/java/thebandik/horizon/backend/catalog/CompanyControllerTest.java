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
import thebandik.horizon.backend.catalog.company.Company;
import thebandik.horizon.backend.catalog.company.CompanyRepository;
import thebandik.horizon.backend.catalog.company.dto.CompanyRequest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
class CompanyControllerTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CompanyRepository companyRepository;

    @Test
    void create_shouldReturn201_whenCompanyIsValid() throws Exception {
        CompanyRequest request = new CompanyRequest("Microsoft");

        mockMvc.perform(post("/api/company")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void getAll_shouldReturn200_whenCompanyExist() throws Exception {
        companyRepository.save(new Company(null, "Microsoft"));
        companyRepository.save(new Company(null, "Sony"));

        mockMvc.perform(get("/api/company")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void getById_shouldReturn200_whenCompanyExists() throws Exception {
        Company saved = companyRepository.save(new Company(null, "Microsoft"));

        mockMvc.perform(get("/api/company/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void update_shouldReturn200_whenCompanyIsValid() throws Exception {
        Company saved = companyRepository.save(new Company(null, "Microsoft"));

        CompanyRequest request = new CompanyRequest("Sony");

        mockMvc.perform(put("/api/company/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void delete_shouldReturn204_whenCompanyExists() throws Exception {
        Company saved = companyRepository.save(new Company(null, "Microsoft"));

        mockMvc.perform(delete("/api/company/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void create_shouldReturn409_whenNameAlreadyExists() throws Exception {
        CompanyRequest first = new CompanyRequest("Microsoft");
        CompanyRequest second = new CompanyRequest("Microsoft");

        // Первая — ок
        mockMvc.perform(post("/api/company")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(first)))
                .andExpect(status().isCreated());

        // Вторая — конфликт по name
        mockMvc.perform(post("/api/company")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(second)))
                .andExpect(status().isConflict());
    }

    @Test
    void getById_shouldReturn404_whenCompanyNotFound() throws Exception {
        mockMvc.perform(get("/api/company/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void update_shouldReturn404_whenCompanyNotFound() throws Exception {
        CompanyRequest request = new CompanyRequest("Microsoft");

        mockMvc.perform(put("/api/company/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_shouldReturn404_whenCompanyNotFound() throws Exception {
        mockMvc.perform(delete("/api/company/{id}", 9999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
