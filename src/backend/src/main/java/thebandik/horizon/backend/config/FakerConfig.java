package thebandik.horizon.backend.config;

import net.datafaker.Faker;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Locale;

@Configuration
public class FakerConfig {
    @Bean
    public Faker faker() {
        return new Faker(Locale.forLanguageTag("en"));
    }
}
