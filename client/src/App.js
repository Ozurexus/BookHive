import React from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRouter from './components/AppRouter';
import AuthProvider from "./context/AuthProvider";
import './styles/App.css'


function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRouter/>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
