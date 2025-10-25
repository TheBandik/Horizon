import {
    Anchor,
    Button, Flex,
    Group,
    Paper,
    PasswordInput, Space,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import {useForm} from '@mantine/form';
import {ThemeToggle} from "../components/ThemeToggle.tsx";
import packageJson from '../../package.json';
import {LanguageSwitcher} from "../components/LanguageSwitcher.tsx";
import { useTranslation } from 'react-i18next';

export function AuthForm() {
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

    const { t } = useTranslation();

    return (
        <Stack
            justify="space-around"
            align="center"
            h="100vh"
        >
            <Text
                size="100px"
                fw={700}
                variant="gradient"
            >
                Horizon
            </Text>

            <Paper
                withBorder p="xl"
            >
                <Text size="lg" fw={500} ta="center">
                    {t("welcome")}
                </Text>

                <Space
                    h="lg"
                ></Space>

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

                    <Group justify="space-between" mt="xl">
                        <Anchor component="button" type="button" c="dimmed" size="xs">
                            {t("no_account")}
                        </Anchor>
                        <Button type="submit">
                            {t("login_button")}
                        </Button>
                    </Group>
                </form>
            </Paper>

            <Space
                h="xl"
            ></Space>


            <Flex
                align="center"
                justify="center"
                w="100%"
                pos="relative"
            >
                <Text
                    size="xs"
                >
                    © 2025 Horizon v{packageJson.version} by Arkadiy Schneider
                </Text>

                <div style={{position: 'absolute', right: 20}}>
                    <Group
                        gap="xs"
                    >
                        <LanguageSwitcher/>
                        <ThemeToggle/>
                    </Group>
                </div>
            </Flex>
        </Stack>
    );
}
