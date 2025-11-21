package thebandik.horizon.backend.catalog.genre;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thebandik.horizon.backend.catalog.genre.dto.GenreRequest;
import thebandik.horizon.backend.catalog.genre.dto.GenreResponse;

import java.util.List;

@RestController
@RequestMapping("/api/genre")
public class GenreController {

    private final GenreService genreService;

    public GenreController(GenreService genreService) {
        this.genreService = genreService;
    }

    @PostMapping
    public ResponseEntity<GenreResponse> create(@RequestBody GenreRequest request) {
        Genre genre = genreService.create(request);

        GenreResponse response = new GenreResponse(
                genre.getId(),
                genre.getName()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<GenreResponse> getAll() {
        return genreService.getAll().stream()
                .map(genre -> new GenreResponse(
                        genre.getId(),
                        genre.getName()
                ))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GenreResponse> getById(@PathVariable Long id) {
        Genre genre = genreService.getById(id);

        GenreResponse response = new GenreResponse(
                genre.getId(),
                genre.getName()
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GenreResponse> update(@PathVariable Long id, @RequestBody GenreRequest request) {
        Genre genre = genreService.update(id, request);

        GenreResponse response = new GenreResponse(
                genre.getId(),
                genre.getName()
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        genreService.delete(id);
    }
}
