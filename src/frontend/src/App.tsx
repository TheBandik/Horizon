import {createTheme, MantineProvider} from '@mantine/core';

import '@mantine/core/styles.css';

import {AuthForm} from "./pages/AuthForm.tsx";

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
                '#C91A25',
                '#A1141D',
                '#7A0F16',
            ],
            accent: [
                '#FFF8E1',
                '#FFE9B5',
                '#FFD27A',
                '#FFBA3F',
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
        <AuthForm></AuthForm>
    }</MantineProvider>;
}
