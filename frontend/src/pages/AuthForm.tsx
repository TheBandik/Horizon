import { useState } from "react";
import { TextInput, PasswordInput, Button, Container, Title, Text, Anchor, Paper, Group, Checkbox } from "@mantine/core";
import { useNavigate } from "react-router-dom";

import { registerUser, loginUser } from "../api/auth";

interface AuthFormProps {
    mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        console.log("handleSubmit called");
        setLoading(true);
        setError(null);
    
        try {
            let response;
            if (mode === "login") {
                console.log("Logging in with:", email, password);
                response = await loginUser(email, password);
            } else {
                console.log("Registering with:", username, name, email, password);
                response = await registerUser(username, name, email, password);
            }
    
            console.log("Response:", response);
    
            if (!response.success) {
                throw new Error(response.message || "Something went wrong");
            }
    
            console.log("Success:", response);
            navigate(mode === "login" ? "/dashboard" : "/login");
        } catch (err: any) {
            console.error("Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <Container size={420} my={40}>
            <Title ta="center">{mode === "login" ? "Log In" : "Sign Up"}</Title>

            {mode === "login" && (
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Do not have an account yet?{" "}
                    <Anchor size="sm" component="button" onClick={() => navigate("/register")}>
                        Create account
                    </Anchor>
                </Text>
            )}

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                {mode === "register" && (
                    <>
                        <TextInput
                            label="Username"
                            placeholder="grondy"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            mt="md"
                        />
                        <TextInput
                            label="Name"
                            placeholder="Alex Gordon"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            mt="md"
                        />
                    </>
                )}
                <TextInput
                    label="Email"
                    placeholder="alex@horizon.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    mt="md"
                />
                <PasswordInput
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    mt="md"
                />
                {mode === "login" && (
                    <Group justify="space-between" mt="lg">
                        <Checkbox label="Remember me" />
                        <Anchor component="button" size="sm">
                            Forgot password?
                        </Anchor>
                    </Group>
                )}
            </Paper>
            <Button fullWidth mt="xl" onClick={handleSubmit}>
                {mode === "login" ? "Log In" : "Sign Up"}
            </Button>
        </Container>
    );
}
