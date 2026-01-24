package thebandik.horizon.backend.user;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import thebandik.horizon.backend.common.CurrentUser;

@RestController
@RequestMapping("api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserPublicResponse me(@CurrentUser Long userId) {
        return userService.getById(userId);
    }

    @GetMapping("/by-username/{username}")
    public UserPublicResponse byUsername(@PathVariable String username) {
        return userService.getByUsername(username);
    }
}
