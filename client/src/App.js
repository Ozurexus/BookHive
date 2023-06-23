import React, {useEffect, useState} from 'react';
import {BrowserRouter, Navigate} from "react-router-dom";
import AppRouter from './components/AppRouter';
import './styles/App.css'
import {AuthContext} from "./context";


function App() {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        if(localStorage.getItem('auth')) {
            setIsAuth(true);
        }
    }, )

    return (
        <AuthContext.Provider value={{
            isAuth,
            setIsAuth
        }}>
            <BrowserRouter>
                {!isAuth && (
                    <Navigate to='/login' replace={true}/>
                )}
                <AppRouter/>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
