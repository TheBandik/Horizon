package thebandik.horizon.backend.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import thebandik.horizon.backend.integrations.rawg.RawgProperties;

@Configuration
@EnableConfigurationProperties(RawgProperties.class)
public class RawgConfig {}
