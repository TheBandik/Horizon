package thebandik.horizon.backend.catalog.company;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thebandik.horizon.backend.catalog.company.dto.CompanyRequest;
import thebandik.horizon.backend.catalog.company.dto.CompanyResponse;

import java.util.List;

@RestController
@RequestMapping("/api/company")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping
    public ResponseEntity<CompanyResponse> create(@RequestBody CompanyRequest request) {
        Company company = companyService.create(request);

        CompanyResponse response = new CompanyResponse(
                company.getId(),
                company.getName()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<CompanyResponse> getAll() {
        return companyService.getAll().stream()
                .map(company -> new CompanyResponse(
                        company.getId(),
                        company.getName()
                ))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponse> getById(@PathVariable Long id) {
        Company company = companyService.getById(id);

        CompanyResponse response = new CompanyResponse(
                company.getId(),
                company.getName()
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompanyResponse> update(@PathVariable Long id, @RequestBody CompanyRequest request) {
        Company company = companyService.update(id, request);

        CompanyResponse response = new CompanyResponse(
                company.getId(),
                company.getName()
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        companyService.delete(id);
    }
}
