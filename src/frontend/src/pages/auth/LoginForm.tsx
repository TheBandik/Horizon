import {
    Anchor,
    Button,
    PasswordInput,
    Stack,
    TextInput,
} from '@mantine/core';
import {useForm} from '@mantine/form';
import {useTranslation} from 'react-i18next';

export function LoginForm() {
    const form = useForm({
        initialValues: {
            email: '',
            name: '',
            password: '',
            terms: true,
        },

        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
        },
    });

    const {t} = useTranslation();

    return (
        <form onSubmit={form.onSubmit(() => {
        })}>
            <Stack>
                <TextInput
                    required
                    label="Email / Username"
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
