package thebandik.horizon.backend.catalog.status;

import org.springframework.stereotype.Service;
import thebandik.horizon.backend.catalog.status.dto.StatusRequest;
import thebandik.horizon.backend.catalog.status.dto.StatusResponse;
import thebandik.horizon.backend.common.errors.AlreadyExistsException;
import thebandik.horizon.backend.common.errors.NotFoundException;

import java.util.List;

@Service
public class StatusService {

    public final StatusRepository statusRepository;
    private final StatusMapper statusMapper;

    public StatusService(
            StatusRepository statusRepository,
            StatusMapper statusMapper
    ) {
        this.statusRepository = statusRepository;
        this.statusMapper = statusMapper;
    }

    public StatusResponse create(StatusRequest request) {
        String name = request.name();

        if (statusRepository.existsByName(name)) {
            throw new AlreadyExistsException("STATUS", "Status", name);
        }

        Status status = new Status();

        status.setName(name);
        status.setCode(request.code());
        status.setScope(request.scope());

        return statusMapper.toResponse(statusRepository.save(status));
    }

    public List<StatusResponse> getAll() {
        return statusRepository.findAll().stream()
                .map(statusMapper::toResponse)
                .toList();
    }

    public StatusResponse getById(Long id) {
        Status status = statusRepository.findById(id).orElseThrow(() ->
                new NotFoundException("STATUS", "Status", id.toString())
        );

        return statusMapper.toResponse(status);
    }

    public void delete(Long id) {
        if (!statusRepository.existsById(id)) {
            throw new NotFoundException("STATUS", "Status", id.toString());
        }

        statusRepository.deleteById(id);
    }
}
