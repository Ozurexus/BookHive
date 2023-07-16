import React, {useEffect, useState} from 'react';
import {AuthContext, UserContext} from "./index";
import {
    AuthorizationError,
    getRatedBooks,
    getRecommendedBooks,
    getUserStatus,
    getWishesBooks
} from "../utils/backendAPI";
import {Logout} from "./util";

function ContextProvider({children}) {
    const [isAuth, setIsAuth] = useState(false);
    const [userId, setUserId] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [isLoading, setLoading] = useState(true);
    const [isFetchingRatedBooks, setIsFetchingRatedBooks] = useState(false);

    // status + reviewed books
    const [isFetchingUserInfo, setIsFetchingUserInfo] = useState(false);

    const [isFetchingRecommendations, setIsFetchingRecommendations] = useState(false);

    const [books, setBooks] = useState([]);
    const [userLogin, setUserLogin] = useState('');
    const [recBooks, setRecBooks] = useState([]);
    const [status, setStatus] = useState("");
    const [numReviewedBooks, setNumReviewedBooks] = useState(0);
    const [wishesBooks, setWishesBooks] = useState([])

    useEffect(() => {
        console.log("ContextProvider-UseEffect");
        if (localStorage.getItem('auth') === 'true') {
            setIsAuth(true);
            setAccessToken(localStorage.getItem('accessToken'));
            setUserId(localStorage.getItem('userId'));
            setUserLogin(localStorage.getItem('userLogin'));
            setIsFetchingRatedBooks(true);
            setIsFetchingUserInfo(true);
            setIsFetchingRecommendations(true);
            setRecBooks([]);
            getUserStatus(localStorage.getItem('userId'), localStorage.getItem('accessToken'))
                .then((obj) => {
                    console.log("User status:", obj.status);
                    console.log("Reviewed books:", obj.reviewed_books);
                    setStatus(obj.status);
                    setIsFetchingUserInfo(false);
                    setNumReviewedBooks(obj.reviewed_books)
                }).catch((err) => {
                    if (err instanceof AuthorizationError) {
                        Logout(setIsAuth, setAccessToken, setUserId, setNumReviewedBooks);
                        console.log(err);
                    }
                })
            if (numReviewedBooks === 0) {
                return;
            }
            getRatedBooks(localStorage.getItem('userId'), localStorage.getItem('accessToken'))
                .then(obj => {
                    setBooks(obj.items);
                    setIsFetchingRatedBooks(false);
                }).catch((err) => {
                if (err instanceof AuthorizationError) {
                    Logout(setIsAuth, setAccessToken, setUserId, setNumReviewedBooks);
                    console.log(err);
                }
            })
            getRecommendedBooks(localStorage.getItem('userId'), localStorage.getItem('accessToken'), 10)
                .then((obj) => {
                    console.log("Rec books:", obj.items);
                    setRecBooks(obj.items);
                    setIsFetchingRecommendations(false);
                }).catch((err) => {
                if (err instanceof AuthorizationError) {
                    Logout(setIsAuth, setAccessToken, setUserId, setNumReviewedBooks);
                    console.log(err);
                }
            })
            getWishesBooks(localStorage.getItem('userId'), localStorage.getItem('accessToken')).then((obj) => {
                console.log("Wishes books: ", obj.items);
                setWishesBooks(obj.items);
            }).catch((err) => {
                if (err instanceof AuthorizationError) {
                    Logout(setIsAuth, setAccessToken, setUserId, setNumReviewedBooks);
                    console.log(err);
                }
            })
        }
        setLoading(false);
    }, [numReviewedBooks, isAuth]);

    return (
        <AuthContext.Provider value={{
            isAuth,
            setIsAuth,
            userId,
            setUserId,
            accessToken,
            setAccessToken,
            isLoading,
            setLoading,
            numReviewedBooks,
            setNumReviewedBooks,
        }}>
            <UserContext.Provider value={{
                isFetchingRecommendations,
                isFetchingRatedBooks,
                isFetchingUserInfo,
                books,
                setBooks,
                recBooks,
                setRecBooks,
                userLogin,
                setUserLogin,
                status,
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