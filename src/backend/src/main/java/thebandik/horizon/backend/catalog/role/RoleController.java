package thebandik.horizon.backend.catalog.role;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thebandik.horizon.backend.catalog.role.dto.RoleRequest;
import thebandik.horizon.backend.catalog.role.dto.RoleResponse;

import java.util.List;

@RestController
@RequestMapping("/api/role")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping
    public ResponseEntity<RoleResponse> create(@RequestBody RoleRequest request) {
        Role role = roleService.create(request);

        RoleResponse response = new RoleResponse(
                role.getId(),
                role.getName()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<RoleResponse> getAll() {
        return roleService.getAll().stream()
                .map(role -> new RoleResponse(
                        role.getId(),
                        role.getName()
                ))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoleResponse> getById(@PathVariable Long id) {
        Role role = roleService.getById(id);

        RoleResponse response = new RoleResponse(
                role.getId(),
                role.getName()
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoleResponse> update(@PathVariable Long id, @RequestBody RoleRequest request) {
        Role role = roleService.update(id, request);

        RoleResponse response = new RoleResponse(
                role.getId(),
                role.getName()
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        roleService.delete(id);
    }
}
