import React from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRouter from './components/AppRouter';
import ContextProvider from "./context/ContextProvider";
import './styles/App.css'


function App() {
    return (
        <ContextProvider>
            <BrowserRouter>
                <AppRouter/>
            </BrowserRouter>
        </ContextProvider>
    );
}

export default App;
