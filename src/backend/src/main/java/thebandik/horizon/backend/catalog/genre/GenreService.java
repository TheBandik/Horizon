package thebandik.horizon.backend.catalog.genre;

import org.springframework.stereotype.Service;
import thebandik.horizon.backend.catalog.genre.dto.GenreRequest;
import thebandik.horizon.backend.common.errors.AlreadyExistsException;
import thebandik.horizon.backend.common.errors.NotFoundException;

import java.util.List;

@Service
public class GenreService {

    private final GenreRepository genreRepository;

    public GenreService(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    public Genre create(GenreRequest request) {

        String name = request.name();

        if (genreRepository.existsByName(name)) {
            throw new AlreadyExistsException("GENRE", "Genre", name);
        }

        Genre genre = new Genre();

        genre.setName(name);

        return genreRepository.save(genre);
    }

    public List<Genre> getAll() {
        return genreRepository.findAll();
    }

    public Genre getById(Long id) {
        return genreRepository.findById(id).orElseThrow(() ->
                new NotFoundException("GENRE", "Genre", id.toString())
        );
    }

    public Genre update(Long id, GenreRequest request) {

        Genre genre = genreRepository.findById(id).orElseThrow(() ->
                new NotFoundException("GENRE", "Genre", id.toString())
        );

        genre.setName(request.name());

        return genreRepository.save(genre);
    }

    public void delete(Long id) {
        if (!genreRepository.existsById(id)) {
            throw new NotFoundException("GENRE", "Genre", id.toString());
        }

        genreRepository.deleteById(id);
    }
}
