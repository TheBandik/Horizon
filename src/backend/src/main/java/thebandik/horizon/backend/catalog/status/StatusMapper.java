package thebandik.horizon.backend.catalog.status;

import org.springframework.stereotype.Component;
import thebandik.horizon.backend.catalog.status.dto.StatusResponse;

@Component
public class StatusMapper {
    public StatusResponse toResponse(Status status) {
        return new StatusResponse(
                status.getId(),
                status.getName(),
                status.getCode(),
                status.getScope()
        );
    }
}
