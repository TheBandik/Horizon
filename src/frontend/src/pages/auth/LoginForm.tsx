import {Anchor, Button, PasswordInput, Stack, TextInput,} from '@mantine/core';
import {useForm} from '@mantine/form';
import {useTranslation} from 'react-i18next';
import {type ApiError, loginUser} from "../../api/auth.ts";
import {useNavigate} from "react-router-dom";

export function LoginForm() {
    const {t} = useTranslation();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            login: '',
            password: ''
        }
    });

    const handleSubmit = async (values: typeof form.values) => {
        form.clearErrors();

        try {
            await loginUser({
                login: values.login,
                password: values.password,
            });

            navigate('/user');
        } catch (err) {
            const error = err as ApiError;

            if (error.code === 'LOGIN_NOT_FOUND') {
                form.setFieldError('login', t('invalid_login'));
            } else if (error.code == 'UNAUTHORIZED') {
                form.setFieldError('password', t('invalid_password'));
            }
        }
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
                <TextInput
                    required
                    label="Email / Username"
                    placeholder="user@horizon.com"
                    value={form.values.login}
                    radius="md"
                    {...form.getInputProps('login')}
                />

                <PasswordInput
                    required
                    label={t("password")}
                    placeholder={t("password_placeholder")}
                    value={form.values.password}
                    radius="md"
                    {...form.getInputProps('password')}
                />
            </Stack>

            <Stack justify="space-between" mt="xl" align={"center"}>
                <Anchor component="button" type="button" c="dimmed" size="xs">
                    {t("no_account")}
                </Anchor>
                <Button type="submit" w={"fit-content"}>
                    {t("login_button")}
                </Button>
            </Stack>
        </form>
    );
}
