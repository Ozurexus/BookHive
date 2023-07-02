import React, {useEffect, useState} from 'react';
import {AuthContext, UserContext} from "./index";
import {getRatedBooks, getRecommendedBooks} from "../utils/backendAPI";

function ContextProvider({children}) {
    const [isAuth, setIsAuth] = useState(false);
    const [userId, setUserId] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [isLoading, setLoading] = useState(true);

    const [books, setBooks] = useState([]);
    const [userLogin, setUserLogin] = useState('');
    const [recBooks, setRecBooks] = useState([]);


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
            getRecommendedBooks(localStorage.getItem('userId'), localStorage.getItem('accessToken'))
                .then((obj) => {
                    console.log(obj.items);
                    setRecBooks(obj.items);
                })
        }
        setLoading(false);
    }, [isAuth]);

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
                recBooks,
                setRecBooks,
                userLogin,
                setUserLogin
            }}>
                {children}
            </UserContext.Provider>
        </AuthContext.Provider>
    );
}

export default ContextProvider;