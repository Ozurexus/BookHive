import React, {useEffect, useState} from 'react';
import {AuthContext, UserContext} from "./index";
import {getRatedBooks} from "../utils/backendAPI";

function ContextProvider({children}) {
    const [isAuth, setIsAuth] = useState(false);
    const [userId, setUserId] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [isLoading, setLoading] = useState(true);

    const [books, setBooks] = useState([]);
    const [userLogin, setUserLogin] = useState('');

    useEffect(() => {
        console.log("ContextProvider-UseEffect")
        if (localStorage.getItem('auth') === 'true') {
            setIsAuth(true);
            setAccessToken(localStorage.getItem('accessToken'));
            setUserId(localStorage.getItem('userId'));
            setUserLogin(localStorage.getItem('userLogin'));
            getRatedBooks(localStorage.getItem('userId'), localStorage.getItem('accessToken'))
                .then(obj => {
                    setBooks(obj.items);
                })
        }
        setLoading(false);
    }, [])

    return (
        <AuthContext.Provider value={{
            isAuth,
            setIsAuth,
            userId,
            setUserId,
            accessToken,
            setAccessToken,
            isLoading,
            setLoading
        }}>
            <UserContext.Provider value={{
                books,
                setBooks,
                userLogin,
                setUserLogin
            }}>
                {children}
            </UserContext.Provider>
        </AuthContext.Provider>
    );
}

export default ContextProvider;