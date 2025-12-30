package thebandik.horizon.backend;

import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;

@ActiveProfiles("test")
public abstract class BaseIntegrationTest {

    @SuppressWarnings("resource")
    static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>("postgres:16-alpine")
                    .withDatabaseName("testdb")
                    .withUsername("test")
                    .withPassword("test");

    static {
        POSTGRES.start();
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            try { POSTGRES.stop(); } catch (Exception ignored) {}
        }));
    }

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry registry) {
        // БД
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);

        // Flyway
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
        registry.add("spring.flyway.enabled", () -> "true");

        // Капча
        registry.add("yandex.smartcaptcha.secret-key", () -> "secret-key");
        registry.add("yandex.smartcaptcha.enabled", () -> "false");
        registry.add("yandex.smartcaptcha.bypass-token", () -> "test-bypass");

        // JWT
        registry.add("app.security.jwt.secret", () -> "test-test-test-jwt-secret-test-test-test");

        // S3
        registry.add("s3.enabled", () -> "false");
    }
}
