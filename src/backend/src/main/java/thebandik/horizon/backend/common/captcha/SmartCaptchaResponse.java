package thebandik.horizon.backend.common.captcha;

public record SmartCaptchaResponse(
        String status,
        String message
) {
    public boolean isOk() {
        return "ok".equalsIgnoreCase(status);
    }
}
