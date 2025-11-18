package thebandik.horizon.backend.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import thebandik.horizon.backend.auth.dto.LoginRequest;
import thebandik.horizon.backend.auth.dto.RegisterRequest;
import thebandik.horizon.backend.user.UserRepository;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        // Очистка таблицы перед каждым тестом
        userRepository.deleteAll();
    }

    @Test
    void register_shouldReturn201_whenUserIsValid() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "testuser",
                "test@example.com",
                "secret"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void register_shouldReturn409_whenEmailAlreadyExists() throws Exception {
        RegisterRequest first = new RegisterRequest(
                "user1",
                "same@example.com",
                "secret"
        );

        RegisterRequest second = new RegisterRequest(
                "user2",
                "same@example.com",
                "secret2"
        );

        // Первая регистрация — ок
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(first)))
                .andExpect(status().isCreated());

        // Вторая регистрация — конфликт по email
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(second)))
                .andExpect(status().isConflict());
    }

    @Test
    void register_shouldReturn409_whenUsernameAlreadyExists() throws Exception {
        RegisterRequest first = new RegisterRequest(
                "sameuser",
                "first@example.com",
                "secret"
        );

        RegisterRequest second = new RegisterRequest(
                "sameuser",
                "second@example.com",
                "secret2"
        );

        // Первая регистрация — ок
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(first)))
                .andExpect(status().isCreated());

        // Вторая регистрация — конфликт по username
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(second)))
                .andExpect(status().isConflict());
    }

    @Test
    void login_shouldReturn200_whenCredentialsAreValid() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "loginuser",
                "login@example.com",
                "secret"
        );

        LoginRequest loginRequest = new LoginRequest(
                "login@example.com",
                "secret"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk());
    }

    @Test
    void login_shouldReturn404_whenEmailNotFound() throws Exception {
        LoginRequest loginRequest = new LoginRequest(
                "notfound@example.com",
                "anypassword"
        );

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    void login_shouldReturn401_whenPasswordIsInvalid() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "loginuser2",
                "login2@example.com",
                "secret"
        );

        LoginRequest loginRequest = new LoginRequest(
                "login2@example.com",
                "wrong"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }
}
