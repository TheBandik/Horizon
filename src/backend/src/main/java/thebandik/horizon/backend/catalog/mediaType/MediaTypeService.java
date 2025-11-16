package thebandik.horizon.backend.catalog.mediaType;

import org.springframework.stereotype.Service;
import thebandik.horizon.backend.catalog.mediaType.error.MediaTypeAlreadyExistsException;
import thebandik.horizon.backend.catalog.mediaType.error.MediaTypeNotFoundException;

import java.util.List;

@Service
public class MediaTypeService {

    private final MediaTypeRepository mediaTypes;

    public MediaTypeService(MediaTypeRepository mediaTypes) {
        this.mediaTypes = mediaTypes;
    }

    public MediaTypeEntity create(MediaTypeRequest request) {
        String name = request.name();

        if (mediaTypes.existsByName(name)) {
            throw new MediaTypeAlreadyExistsException(name);
        }

        MediaTypeEntity mediaType = new MediaTypeEntity();
        mediaType.setName(name);

        return mediaTypes.save(mediaType);
    }

    public List<MediaTypeEntity> getAll() {
        return mediaTypes.findAll();
    }

    public MediaTypeEntity getById(Long id) {
        return mediaTypes.findById(id).orElseThrow(() -> new MediaTypeNotFoundException(id));
    }

    public MediaTypeEntity update(Long id, MediaTypeRequest request) {
        MediaTypeEntity mediaType = mediaTypes.findById(id)
                .orElseThrow(() -> new MediaTypeNotFoundException(id));

        mediaType.setName(request.name());

        return mediaTypes.save(mediaType);
    }

    public void delete(Long id) {
        if (!mediaTypes.existsById(id)) {
            throw new MediaTypeNotFoundException(id);
        }

        mediaTypes.deleteById(id);
    }
}
