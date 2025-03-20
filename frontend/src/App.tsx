import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MantineProvider } from "@mantine/core";

import '@mantine/core/styles.css';

import { Home } from "./pages/Home"
import { AuthForm } from "./pages/AuthForm";

export default function App() {

  return (
    <MantineProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<AuthForm mode="register" />} />
          <Route path="/login" element={<AuthForm mode="login" />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
};
