package thebandik.horizon.backend.common.captcha;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class SmartCaptchaClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${yandex.smartcaptcha.secret-key}")
    private String secretKey;

    @Value("${yandex.smartcaptcha.validate-url}")
    private String validateUrl;

    @Value("${yandex.smartcaptcha.bypass-token}")
    private String bypassToken;

    @Value("${yandex.smartcaptcha.enabled}")
    private Boolean enabled;

    public boolean verify(String token, String userIp) {
        if (bypassToken.equals(token)) {
            return true; // dev
        }

        if (!enabled) {
            return true; // test
        }

        if (token == null || token.isBlank()) {
            return false;
        }

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("secret", secretKey);
        body.add("token", token);
        if (userIp != null && !userIp.isBlank()) {
            body.add("ip", userIp);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> requestEntity =
                new HttpEntity<>(body, headers);

        ResponseEntity<SmartCaptchaResponse> response =
                restTemplate.postForEntity(
                        validateUrl,
                        requestEntity,
                        SmartCaptchaResponse.class
                );

        SmartCaptchaResponse respBody = response.getBody();
        return respBody != null && respBody.isOk();
    }
}
