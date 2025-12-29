import {Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import {useEffect} from 'react';

import {AuthForm} from './pages/auth/AuthForm';
import {LoginForm} from './pages/auth/LoginForm';
import {RegisterForm} from './pages/auth/RegisterForm';
import {UserProfile} from './pages/UserProfile';
import {CreateMedia} from './pages/CreateMedia';
import {RequireAuth} from './components/RequireAuth';
import {registerUnauthorizedHandler} from './api/http';

export function AppRouter() {
    const navigate = useNavigate();

    useEffect(() => {
        registerUnauthorizedHandler(() => {
            navigate('/auth/login', {replace: true});
        });
    }, [navigate]);

    return (
        <Routes>
            {/* Публичная зона */}
            <Route path="/auth">
                <Route
                    path="login"
                    element={
                        <AuthForm>
                            <LoginForm/>
                        </AuthForm>
                    }
                />
                <Route
                    path="register"
                    element={
                        <AuthForm>
                            <RegisterForm/>
                        </AuthForm>
                    }
                />
            </Route>

            {/* Приватная зона */}
            <Route element={<RequireAuth/>}>
                <Route
                    path="/user"
                    element={
                        <UserProfile/>
                    }
                />
                <Route
                    path="/create"
                    element={
                        <CreateMedia/>
                    }
                />
            </Route>

            {/* Фоллбек */}
            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    );
}