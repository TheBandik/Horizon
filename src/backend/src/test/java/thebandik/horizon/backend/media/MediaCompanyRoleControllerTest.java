package thebandik.horizon.backend.media;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import thebandik.horizon.backend.catalog.company.Company;
import thebandik.horizon.backend.catalog.company.CompanyRepository;
import thebandik.horizon.backend.catalog.mediaType.MediaTypeEntity;
import thebandik.horizon.backend.catalog.mediaType.MediaTypeRepository;
import thebandik.horizon.backend.catalog.role.Role;
import thebandik.horizon.backend.catalog.role.RoleRepository;
import thebandik.horizon.backend.media.mediaCompanyRole.MediaCompanyRoleRepository;
import thebandik.horizon.backend.media.mediaCompanyRole.dto.MediaCompanyRoleRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
public class MediaCompanyRoleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MediaRepository mediaRepository;

    @Autowired
    private MediaTypeRepository mediaTypeRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private MediaCompanyRoleRepository mediaCompanyRoleRepository;

    @BeforeEach
    void setUp() {
        mediaCompanyRoleRepository.deleteAll();
        mediaRepository.deleteAll();
        companyRepository.deleteAll();
        roleRepository.deleteAll();
        mediaTypeRepository.deleteAll();
    }

    @Test
    void create_shouldReturn201_whenMediaCompanyRoleIsValid() throws Exception {
        MediaTypeEntity mediaType = mediaTypeRepository.save(new MediaTypeEntity(null, "Movie"));
        Company company = companyRepository.save(new Company(null, "WB"));
        Role role = roleRepository.save(new Role(null, "Dev"));
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

        MediaCompanyRoleRequest request = new MediaCompanyRoleRequest(
                media.getId(),
                company.getId(),
                role.getId()
        );

        mockMvc.perform(post("/api/media-company-role")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }
}
