import {Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import {useEffect} from 'react';

import {AuthForm} from './pages/auth/AuthForm';
import {LoginForm} from './pages/auth/LoginForm';
import {RegisterForm} from './pages/auth/RegisterForm';
import {UserProfile} from './pages/UserProfile';
import {CreateMedia} from './pages/CreateMedia';
import {RequireAuth} from './components/RequireAuth';
import {registerUnauthorizedHandler} from './api/http';
import {useCurrentUser} from "./hooks/useCurrentUser.ts";

function UserRedirect() {
    const {user, loading} = useCurrentUser();
    if (loading) return null;
    if (!user) return <Navigate to="/auth/login" replace/>;

    return <Navigate to={`/user/${user.username}`} replace/>;
}

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
                        <UserRedirect />
                    }
                />
                <Route
                    path="/user/:username"
                    element={
                        <UserProfile />
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
            <Route path="/" element={<Navigate to="/user" replace/>}/>
        </Routes>
    );
}