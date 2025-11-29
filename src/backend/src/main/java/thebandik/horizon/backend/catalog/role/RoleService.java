package thebandik.horizon.backend.catalog.role;

import org.springframework.stereotype.Service;
import thebandik.horizon.backend.catalog.role.dto.RoleRequest;
import thebandik.horizon.backend.common.errors.AlreadyExistsException;
import thebandik.horizon.backend.common.errors.NotFoundException;

import java.util.List;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public Role create(RoleRequest request) {

        String name = request.name();

        if (roleRepository.existsByName(name)) {
            throw new AlreadyExistsException("ROLE", "Role", name);
        }

        Role role = new Role();

        role.setName(name);

        return roleRepository.save(role);
    }

    public List<Role> getAll() {
        return roleRepository.findAll();
    }

    public Role getById(Long id) {
        return roleRepository.findById(id).orElseThrow(() ->
                new NotFoundException("ROLE", "Role", id.toString())
        );
    }

    public Role update(Long id, RoleRequest request) {

        Role role = roleRepository.findById(id).orElseThrow(() ->
                new NotFoundException("ROLE", "Role", id.toString())
        );

        role.setName(request.name());

        return roleRepository.save(role);
    }

    public void delete(Long id) {
        if (!roleRepository.existsById(id)) {
            throw new NotFoundException("ROLE", "Role", id.toString());
        }

        roleRepository.deleteById(id);
    }
}
