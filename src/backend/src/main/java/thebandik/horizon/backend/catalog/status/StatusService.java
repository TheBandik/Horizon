package thebandik.horizon.backend.catalog.status;

import org.springframework.stereotype.Service;
import thebandik.horizon.backend.catalog.status.dto.StatusRequest;
import thebandik.horizon.backend.common.errors.AlreadyExistsException;
import thebandik.horizon.backend.common.errors.NotFoundException;

import java.util.List;

@Service
public class StatusService {

    public final StatusRepository statusRepository;

    public StatusService(StatusRepository statusRepository) {
        this.statusRepository = statusRepository;
    }

    public Status create(StatusRequest request) {
        String name = request.name();

        if (statusRepository.existsByName(name)) {
            throw new AlreadyExistsException("STATUS", "Status", name);
        }

        Status status = new Status();

        status.setName(name);

        return statusRepository.save(status);
    }

    public List<Status> getAll() {
        return statusRepository.findAll();
    }

    public Status getById(Long id) {
        return statusRepository.findById(id).orElseThrow(() ->
                new NotFoundException("STATUS", "Status", id.toString())
        );
    }

    public Status update(Long id, StatusRequest request) {

        Status status = statusRepository.findById(id).orElseThrow(() ->
                new NotFoundException("STATUS", "Status", id.toString())
        );

        status.setName(request.name());

        return statusRepository.save(status);
    }

    public void delete(Long id) {
        if (!statusRepository.existsById(id)) {
            throw new NotFoundException("STATUS", "Status", id.toString());
        }

        statusRepository.deleteById(id);
    }
}
