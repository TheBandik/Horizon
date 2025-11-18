package thebandik.horizon.backend.common.s3;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3StorageService {

    private final S3Client s3;
    private final S3Properties props;

    public S3StorageService(S3Client s3, S3Properties props) {
        this.s3 = s3;
        this.props = props;
    }

    public String upload(MultipartFile file) {
        String key = "posters/" + UUID.randomUUID();

        try {
            s3.putObject(
                    PutObjectRequest.builder()
                            .bucket(props.getBucket())
                            .key(key)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize())
            );

            return key;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload to Yandex S3", e);
        }
    }

    public String getPublicUrl(String key) {
        return "https://storage.yandexcloud.net/" + props.getBucket() + "/" + key;
    }
}
