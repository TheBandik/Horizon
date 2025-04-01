import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {MantineProvider} from "@mantine/core";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import {Home} from "./pages/Home"
import {AuthForm} from "./pages/AuthForm";
import {CreateMedia} from "./pages/CreateMedia";
import {User} from './pages/User';
import ProtectedRoute from "./components/ProtectedRoute.tsx";

export default function App() {
    const isAuthenticated: boolean = !!localStorage.getItem('authToken');
    return (
        <MantineProvider>
            <Router>
                <Routes>
                    <Route path="/register" element={<AuthForm mode="register"/>}/>
                    <Route path="/login" element={<AuthForm mode="login"/>}/>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <Home/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <CreateMedia/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/user"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <User/>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </MantineProvider>
    );
};
