import React, {useEffect, useState} from 'react';
import {AuthContext, UserContext} from "./index";
import {getRatedBooks, getRecommendedBooks, getUserStatus, getWishesBooks} from "../utils/backendAPI";

function ContextProvider({children}) {
    const [isAuth, setIsAuth] = useState(false);
    const [userId, setUserId] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [isLoading, setLoading] = useState(true);

    const [books, setBooks] = useState([]);
    const [userLogin, setUserLogin] = useState('');
    const [recBooks, setRecBooks] = useState([]);
    const [status, setStatus] = useState("");
    const [numReviewedBooks, setNumReviewedBooks] = useState(0);
    const [wishesBooks, setWishesBooks] = useState([])

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
            getRecommendedBooks(localStorage.getItem('userId'), localStorage.getItem('accessToken'), 10)
                .then((obj) => {
                    console.log(obj.items);
                    setRecBooks(obj.items);
                })
            getUserStatus(localStorage.getItem('userId'), localStorage.getItem('accessToken')).then((obj) => {
                console.log("User status:", obj.status);
                console.log("Reviewed books:", obj.reviewed_books);
                setStatus(obj.status);
                setNumReviewedBooks(obj.reviewed_books)
            })
            getWishesBooks(localStorage.getItem('userId'), localStorage.getItem('accessToken')).then((obj) => {
                console.log(obj.items);
                setWishesBooks(obj.items);
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
                setUserLogin,
                status,
                numReviewedBooks,
                setStatus,
                wishesBooks,
                setWishesBooks
            }}>
                {children}
            </UserContext.Provider>
        </AuthContext.Provider>
    );
}

export default ContextProvider;