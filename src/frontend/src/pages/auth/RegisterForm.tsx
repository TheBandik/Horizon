import {
    Button,
    PasswordInput,
    Stack,
    TextInput,
} from '@mantine/core';
import {useForm} from '@mantine/form';
import {useTranslation} from 'react-i18next';

export function RegisterForm() {
    const form = useForm({
        initialValues: {
            username: '',
            email: '',
            name: '',
            password: '',
            repeated_password: '',
            terms: true,
        },
    });

    const {t} = useTranslation();

    return (
        <form onSubmit={form.onSubmit(() => {
        })}>
            <Stack>
                <TextInput
                    required
                    label="Username"
                    placeholder="username"
                    value={form.values.username}
                    onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
                    radius="md"
                />

                <TextInput
                    required
                    label="Email"
                    placeholder="user@horizon.com"
                    value={form.values.email}
                    onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                    radius="md"
                />

                <PasswordInput
                    required
                    label={t("password")}
                    placeholder={t("password_placeholder")}
                    value={form.values.password}
                    onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                    radius="md"
                />

                <PasswordInput
                    required
                    label={t("repeated_password")}
                    placeholder={t("repeated_password_placeholder")}
                    value={form.values.repeated_password}
                    onChange={(event) => form.setFieldValue('repeated_password', event.currentTarget.value)}
                    radius="md"
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
