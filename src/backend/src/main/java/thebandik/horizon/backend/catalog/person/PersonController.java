package thebandik.horizon.backend.catalog.person;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thebandik.horizon.backend.catalog.person.dto.PersonRequest;
import thebandik.horizon.backend.catalog.person.dto.PersonResponse;

import java.util.List;

@RestController
@RequestMapping("/api/person")
public class PersonController {

    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @PostMapping
    public ResponseEntity<PersonResponse> create(@RequestBody PersonRequest request) {
        Person person = personService.create(request);

        PersonResponse response = new PersonResponse(
                person.getId(),
                person.getName()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<PersonResponse> getAll() {
        return personService.getAll().stream()
                .map(person -> new PersonResponse(
                        person.getId(),
                        person.getName()
                ))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonResponse> getById(@PathVariable Long id) {
        Person person = personService.getById(id);

        PersonResponse response = new PersonResponse(
                person.getId(),
                person.getName()
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonResponse> update(@PathVariable Long id, @RequestBody PersonRequest request) {
        Person person = personService.update(id, request);

        PersonResponse response = new PersonResponse(
                person.getId(),
                person.getName()
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        personService.delete(id);
    }
}
