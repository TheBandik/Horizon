package thebandik.horizon.backend.catalog.person;

import org.springframework.stereotype.Service;
import thebandik.horizon.backend.catalog.person.dto.PersonRequest;
import thebandik.horizon.backend.common.errors.AlreadyExistsException;
import thebandik.horizon.backend.common.errors.NotFoundException;

import java.util.List;

@Service
public class PersonService {

    private final PersonRepository personRepository;

    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public Person create(PersonRequest request) {

        String name = request.name();

        if (personRepository.existsByName(name)) {
            throw new AlreadyExistsException("PERSON", "Person", name);
        }

        Person person = new Person();

        person.setName(name);

        return personRepository.save(person);
    }

    public List<Person> getAll() {
        return personRepository.findAll();
    }

    public Person getById(Long id) {
        return personRepository.findById(id).orElseThrow(() ->
                new NotFoundException("PERSON", "Person", id.toString())
        );
    }

    public Person update(Long id, PersonRequest request) {

        Person person = personRepository.findById(id).orElseThrow(() ->
                new NotFoundException("PERSON", "Person", id.toString())
        );

        person.setName(request.name());

        return personRepository.save(person);
    }

    public void delete(Long id) {
        if (!personRepository.existsById(id)) {
            throw new NotFoundException("PERSON", "Person", id.toString());
        }

        personRepository.deleteById(id);
    }
}
