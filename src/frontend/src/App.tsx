import {createTheme, MantineProvider} from '@mantine/core';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';

import {AuthForm} from "./pages/auth/AuthForm.tsx";
import {LoginForm} from "./pages/auth/LoginForm.tsx";
import {RegisterForm} from "./pages/auth/RegisterForm.tsx";
import {UserProfile} from "./pages/UserProfile.tsx";
import {CreateMedia} from "./pages/CreateMedia.tsx";

export default function App() {

    const theme = createTheme({
        primaryColor: "brand",

        colors: {
            brand: [
                '#FFF5F5',
                '#FFCACA',
                '#FFA3A3',
                '#FF7A7A',
                '#FF5252',
                '#FF2A2A',
                '#E51F24',
                // var(--mantine-color-brand-7)
                '#C91A25',
                '#A1141D',
                '#7A0F16',
            ],
            accent: [
                '#FFF8E1',
                '#FFE9B5',
                '#FFD27A',
                '#FFBA3F',
                // var(--mantine-color-accent-4)
                '#FFA903',
                '#E69B00',
                '#CC8B00',
                '#B37B00',
                '#996B00',
                '#805C00',
            ],
        },

        defaultRadius: "xl",

        defaultGradient: {
            from: '#C91A25',
            to: '#FFA903',
            deg: 45,
        },
    });

    return <MantineProvider theme={theme}>{
        <BrowserRouter>
            <Routes>
                {/* Страница авторизации */}
                <Route
                    path="/login"
                    element={
                        <AuthForm>
                            <LoginForm/>
                        </AuthForm>
                    }
                />
                {/*Страница регистрации*/}
                <Route
                    path="/register"
                    element={
                        <AuthForm>
                            <RegisterForm/>
                        </AuthForm>
                    }
                />
                {/* Страница пользователя */}
                <Route
                    path="/user"
                    element={
                        <UserProfile/>
                    }
                />
                {/* Страница добавления нового медиа */}
                <Route
                    path="/create"
                    element={
                        <CreateMedia/>
                    }
                />
            </Routes>
        </BrowserRouter>
    }</MantineProvider>;
}
