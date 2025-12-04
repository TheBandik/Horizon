import { Anchor, Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { type ApiError, loginUser } from '../../api/auth.ts';
import { useNavigate } from 'react-router-dom';
import { SmartCaptcha } from '@yandex/smart-captcha';
import { useState, useCallback } from 'react';

export function LoginForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [captchaKey, setCaptchaKey] = useState(0); // ключ для сброса капчи
    const [submitting, setSubmitting] = useState(false);

    const form = useForm({
        initialValues: {
            login: '',
            password: '',
        },
    });

    const resetCaptcha = useCallback(() => {
        setCaptchaKey((prev) => prev + 1); // форсим размонтирование/монтаж виджета
        setCaptchaToken(null);
    }, []);

    const handleCaptchaSuccess = useCallback((token: string) => {
        setCaptchaToken(token);
    }, []);

    const handleCaptchaExpired = useCallback(() => {
        setCaptchaToken(null);
    }, []);

    const handleSubmit = async (values: typeof form.values) => {
        form.clearErrors();

        if (!captchaToken) {
            form.setFieldError('login', t('captcha_required'));
            return;
        }

        try {
            setSubmitting(true);

            await loginUser({
                login: values.login,
                password: values.password,
                captchaToken,
            });

            navigate('/user');
        } catch (err) {
            const error = err as ApiError;

            if (error.code === 'LOGIN_NOT_FOUND') {
                form.setFieldError('login', t('invalid_login'));
            } else if (error.code === 'UNAUTHORIZED') {
                form.setFieldError('password', t('invalid_password'));
            } else if (error.code === 'CAPTCHA_FAILED') {
                form.setFieldError('login', t('captcha_failed'));
            }
        } finally {
            setSubmitting(false);
            resetCaptcha();
        }
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
                <TextInput
                    required
                    label="Email / Username"
                    placeholder="user@horizon.com"
                    radius="md"
                    {...form.getInputProps('login')}
                />

                <PasswordInput
                    required
                    label={t('password')}
                    placeholder={t('password_placeholder')}
                    radius="md"
                    {...form.getInputProps('password')}
                />

                <SmartCaptcha
                    key={captchaKey} // важный момент: reset через key
                    sitekey={import.meta.env.VITE_YANDEX_SMARTCAPTCHA_SITEKEY}
                    language="ru"
                    onSuccess={handleCaptchaSuccess}
                    onTokenExpired={handleCaptchaExpired}
                />
            </Stack>

            <Stack justify="space-between" mt="xl" align="center">
                <Anchor component="button" type="button" c="dimmed" size="xs">
                    {t('no_account')}
                </Anchor>
                <Button
                    type="submit"
                    w="fit-content"
                    disabled={submitting || !captchaToken}
                >
                    {t('login_button')}
                </Button>
            </Stack>
        </form>
    );
}
