import {Button, PasswordInput, Stack, TextInput,} from '@mantine/core';
import {useForm} from '@mantine/form';
import {useTranslation} from 'react-i18next';
import {type ApiError, registerUser} from "../../api/auth.ts";
import {useNavigate} from "react-router-dom";

export function RegisterForm() {
    const {t} = useTranslation();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            username: '',
            email: '',
            password: '',
            repeated_password: ''
        },
        validate: {
            username: (value) =>
                /^[A-Za-z0-9_-]+$/.test(value)
                    ? null
                    : t('username_invalid'),
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : t('email_invalid'),
            password: (value) =>
                value.length < 8 ? t('password_too_short') : null,
            repeated_password: (value, values) =>
                value !== values.password ? t('passwords_not_match') : null,
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        form.clearErrors();

        try {
            await registerUser({
                username: values.username,
                email: values.email,
                password: values.password,
            });

            navigate('/user');
        } catch (err) {
            console.log('ERR FROM BACKEND:', err);
            const error = err as ApiError;

            if (error.details.email === 'EMAIL_ALREADY_EXISTS') {
                form.setFieldError('email', t('email_already_exists'));
            }

            if (error.details.username === 'USERNAME_ALREADY_EXISTS') {
                form.setFieldError('username', t('username_already_exists'));
            }
        }
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
                <TextInput
                    required
                    label="Username"
                    placeholder="username"
                    value={form.values.username}
                    radius="md"
                    {...form.getInputProps('username')}
                />

                <TextInput
                    required
                    label="Email"
                    placeholder="user@horizon.com"
                    value={form.values.email}
                    radius="md"
                    {...form.getInputProps('email')}
                />

                <PasswordInput
                    required
                    label={t("password")}
                    placeholder={t("password_placeholder")}
                    value={form.values.password}
                    radius="md"
                    {...form.getInputProps('password')}
                />

                <PasswordInput
                    required
                    label={t("repeated_password")}
                    placeholder={t("repeated_password_placeholder")}
                    value={form.values.repeated_password}
                    radius="md"
                    {...form.getInputProps('repeated_password')}
                />
            </Stack>

            <Stack justify="space-between" mt="xl" align={"center"}>
                <Button type="submit" w={"fit-content"}>
                    {t("signup_button")}
                </Button>
            </Stack>
        </form>
    );
}
