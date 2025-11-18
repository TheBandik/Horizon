package thebandik.horizon.backend.media;

import org.springframework.stereotype.Service;
import thebandik.horizon.backend.catalog.mediaType.MediaTypeEntity;
import thebandik.horizon.backend.catalog.mediaType.MediaTypeService;
import thebandik.horizon.backend.common.errors.NotFoundException;
import thebandik.horizon.backend.media.dto.MediaRequest;

import java.util.List;

@Service
public class MediaService {

    private final MediaRepository mediaRepository;
    private final MediaTypeService mediaTypeService;

    private MediaService(MediaRepository mediaRepository, MediaTypeService mediaTypeService) {
        this.mediaRepository = mediaRepository;
        this.mediaTypeService = mediaTypeService;
    }

    public Media create(MediaRequest request) {

        MediaTypeEntity mediaType = mediaTypeService.getById(request.mediaTypeId());

        Media media = new Media();

        media.setTitle(request.title());
        media.setOriginalTitle(request.originalTitle());
        media.setPoster("https://cloud/**");
        media.setReleaseDate(request.releaseDate());
        media.setMediaType(mediaType);

        return mediaRepository.save(media);
    }

    public List<Media> getAll() {
        return mediaRepository.findAll();
    }

    public Media getById(Long id) {
        return mediaRepository.findById(id).orElseThrow(() -> new NotFoundException("MEDIA", "Media", id.toString()));
    }

    public Media update(Long id, MediaRequest request) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("MEDIA", "Media", id.toString()));

        MediaTypeEntity mediaType = mediaTypeService.getById(request.mediaTypeId());

        media.setTitle(request.title());
        media.setOriginalTitle(request.originalTitle());
        media.setPoster("https://cloud/**");
        media.setReleaseDate(request.releaseDate());
        media.setMediaType(mediaType);

        return mediaRepository.save(media);
    }

    public void delete(Long id) {
        if (!mediaRepository.existsById(id)) {
            throw new NotFoundException("MEDIA", "Media", id.toString());
        }

        mediaRepository.deleteById(id);
    }
}
