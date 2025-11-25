package thebandik.horizon.backend.catalog.company;

import org.springframework.stereotype.Service;
import thebandik.horizon.backend.catalog.company.dto.CompanyRequest;
import thebandik.horizon.backend.common.errors.AlreadyExistsException;
import thebandik.horizon.backend.common.errors.NotFoundException;

import java.util.List;

@Service
public class CompanyService {
    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public Company create(CompanyRequest request) {

        String name = request.name();

        if (companyRepository.existsByName(name)) {
            throw new AlreadyExistsException("COMPANY", "Company", name);
        }

        Company company = new Company();

        company.setName(name);

        return companyRepository.save(company);
    }

    public List<Company> getAll() {
        return companyRepository.findAll();
    }

    public Company getById(Long id) {
        return companyRepository.findById(id).orElseThrow(() ->
                new NotFoundException("COMPANY", "Company", id.toString())
        );
    }

    public Company update(Long id, CompanyRequest request) {

        Company company = companyRepository.findById(id).orElseThrow(() ->
                new NotFoundException("COMPANY", "Company", id.toString())
        );

        company.setName(request.name());

        return companyRepository.save(company);
    }

    public void delete(Long id) {
        if (!companyRepository.existsById(id)) {
            throw new NotFoundException("COMPANY", "Company", id.toString());
        }

        companyRepository.deleteById(id);
    }
}
