package thebandik.horizon.backend.catalog.series;

import org.springframework.stereotype.Service;
import thebandik.horizon.backend.catalog.series.dto.SeriesRequest;
import thebandik.horizon.backend.common.errors.AlreadyExistsException;
import thebandik.horizon.backend.common.errors.NotFoundException;

import java.util.List;

@Service
public class SeriesService {

    private final SeriesRepository seriesRepository;

    public SeriesService(SeriesRepository seriesRepository) {
        this.seriesRepository = seriesRepository;
    }

    public Series create(SeriesRequest request) {

        Series parentSeries = request.seriesId() != null ? getById(request.seriesId()) : null;

        String title = request.title();

        if (seriesRepository.existsByTitle(title)) {
            throw new AlreadyExistsException("SERIES", "Series", title);
        }

        Series series = new Series();

        series.setTitle(title);
        series.setSeries(parentSeries);

        return seriesRepository.save(series);
    }

    public List<Series> getAll() {
        return seriesRepository.findAll();
    }

    public Series getById(Long id) {
        return seriesRepository.findById(id).orElseThrow(() -> new NotFoundException("SERIES", "Series", id.toString()));
    }

    public Series update(Long id, SeriesRequest request) {
        Series series = seriesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("SERIES", "Series", id.toString()));

        Series parentSeries = request.seriesId() != null ? getById(request.seriesId()) : null;

        series.setTitle(request.title());
        series.setSeries(parentSeries);

        return seriesRepository.save(series);
    }

    public void delete(Long id) {
        if (!seriesRepository.existsById(id)) {
            throw new NotFoundException("SERIES", "Series", id.toString());
        }

        seriesRepository.deleteById(id);
    }

}
