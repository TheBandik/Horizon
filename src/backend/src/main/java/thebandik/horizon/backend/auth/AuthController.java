package thebandik.horizon.backend.auth;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import thebandik.horizon.backend.auth.dto.LoginRequest;
import thebandik.horizon.backend.auth.dto.LoginResponse;
import thebandik.horizon.backend.auth.dto.RegisterRequest;
import thebandik.horizon.backend.auth.dto.RegisterResponse;
import thebandik.horizon.backend.common.captcha.CaptchaFailedException;
import thebandik.horizon.backend.common.captcha.SmartCaptchaClient;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth;
    private final SmartCaptchaClient smartCaptchaClient;

    public AuthController(AuthService auth, SmartCaptchaClient smartCaptchaClient) {
        this.auth = auth;
        this.smartCaptchaClient = smartCaptchaClient;
    }

    @PostMapping("register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
        RegisterResponse response = auth.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        boolean captchaOk = smartCaptchaClient.verify(request.captchaToken(), null);
        if (!captchaOk) {
            throw new CaptchaFailedException();
        }

        LoginResponse response = auth.login(request);
        return ResponseEntity.ok(response);
    }
}
