import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MantineProvider, RadioIcon } from "@mantine/core";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { Home } from "./pages/Home"
import { AuthForm } from "./pages/AuthForm";
import { CreateMedia } from "./pages/CreateMedia";
import { User } from './pages/User';

export default function App() {

  return (
    <MantineProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<AuthForm mode="register" />} />
          <Route path="/login" element={<AuthForm mode="login" />} />
          <Route path="/media" element={<CreateMedia/>} />
          <Route path="/user" element={<User/>} />
        </Routes>
      </Router>
    </MantineProvider>
  );
};
