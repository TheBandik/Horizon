package thebandik.horizon.backend.common.captcha;

import org.springframework.http.HttpStatus;
import thebandik.horizon.backend.common.ApiException;

public class CaptchaFailedException extends ApiException {

    public CaptchaFailedException() {
        super(
                "CAPTCHA_FAILED",
                "Captcha validation failed",
                HttpStatus.BAD_REQUEST
        );
    }
}
