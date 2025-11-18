package thebandik.horizon.backend.catalog.mediaType;

import org.springframework.stereotype.Service;
import thebandik.horizon.backend.catalog.mediaType.dto.MediaTypeRequest;
import thebandik.horizon.backend.common.errors.AlreadyExistsException;
import thebandik.horizon.backend.common.errors.NotFoundException;

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
            throw new AlreadyExistsException("MEDIA_TYPE", "Media type", name);
        }

        MediaTypeEntity mediaType = new MediaTypeEntity();
        mediaType.setName(name);

        return mediaTypes.save(mediaType);
    }

    public List<MediaTypeEntity> getAll() {
        return mediaTypes.findAll();
    }

    public MediaTypeEntity getById(Long id) {
        return mediaTypes.findById(id).orElseThrow(() -> new NotFoundException("MEDIA_TYPE", "Media type", id.toString()));
    }

    public MediaTypeEntity update(Long id, MediaTypeRequest request) {
        MediaTypeEntity mediaType = mediaTypes.findById(id)
                .orElseThrow(() -> new NotFoundException("MEDIA_TYPE", "Media type", id.toString()));

        mediaType.setName(request.name());

        return mediaTypes.save(mediaType);
    }

    public void delete(Long id) {
        if (!mediaTypes.existsById(id)) {
            throw new NotFoundException("MEDIA_TYPE", "Media type", id.toString());
        }

        mediaTypes.deleteById(id);
    }
}
