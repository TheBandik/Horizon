import {
    Flex,
    Group,
    Paper,
    Space,
    Stack,
    Text,
} from '@mantine/core';
import {ThemeToggle} from "../../components/ThemeToggle.tsx";
import packageJson from '../../../package.json';
import {LanguageSwitcher} from "../../components/LanguageSwitcher.tsx";
import {useTranslation} from 'react-i18next';
import {useMediaQuery} from '@mantine/hooks';

export function AuthForm({children}: { children: React.ReactNode; title?: string }) {

    const {t} = useTranslation();
    const isMobile = useMediaQuery('(max-width: 600px)');

    return (
        <Stack
            justify="space-between"
            align="center"
            h="100vh"
            pt={isMobile ? "20%" : "2%"}
            pb={"2%"}
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
                w={isMobile ? 350 : 400}
                h={"auto"}
            >
                <Text size="lg" fw={500} ta="center">
                    {t("welcome")}
                </Text>

                <Space
                    h="lg"
                ></Space>

                {children}
            </Paper>

            <Space
                h="xl"
            ></Space>


            <Flex
                align="center"
                justify="center"
                w="100%"
                pos="relative"
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? 'xs' : 0}
            >
                {isMobile && (
                    <Group gap="xs" mb="xs">
                        <LanguageSwitcher/>
                        <ThemeToggle/>
                    </Group>
                )}

                <Text size="xs" ta="center">
                    © 2025 Horizon v{packageJson.version} by Arkadiy Schneider
                </Text>

                {!isMobile && (
                    <div style={{position: 'absolute', right: 20}}>
                        <Group gap="xs">
                            <LanguageSwitcher/>
                            <ThemeToggle/>
                        </Group>
                    </div>
                )}
            </Flex>
        </Stack>
    );
}
