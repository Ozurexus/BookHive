import React, {useContext} from 'react';
import {AuthorizationError, getRatedBooks, rateBook, unRateBook} from "../../../utils/backendAPI";
import {Logout} from "../../../context/util";
import {Rating} from "@mui/material";
import MyModal from "../MyModal/MyModal";
import {AuthContext, UserContext} from "../../../context";
import BookInfo from "../BookInfo/BookInfo";
import MyButton from "../Button/MyButton";

function BookPopup({modal, setModal, pickedRate, setPickedRate, pickedBook, prevPickedRate}) {
    const {
        userId,
        accessToken,
        numReviewedBooks,
        setNumReviewedBooks,
        setIsAuth,
        setAccessToken,
        setUserId
    } = useContext(AuthContext);

    const {setBooks} = useContext(UserContext);

    return (
        <MyModal visible={modal} setVisible={() => {
            console.log('pickedBook:', pickedRate);
            setModal(false);
            if (pickedRate !== 0 && pickedRate !== prevPickedRate) {
                rateBook(pickedBook.id, pickedRate * 2, userId, accessToken)
                    .then(resp => {
                        console.log("rated");
                        console.log(resp)
                        setNumReviewedBooks(numReviewedBooks + 1);
                    }).catch((err) => {
                    if (err instanceof AuthorizationError) {
                        Logout(setIsAuth, setAccessToken, setUserId, setNumReviewedBooks);
                        console.log(err);
                    }
                })
                getRatedBooks(userId, accessToken)
                    .then((obj) => {
                        setBooks(obj.items);
                    }).catch((err) => {
                    if (err instanceof AuthorizationError) {
                        Logout(setIsAuth, setAccessToken, setUserId, setNumReviewedBooks);
                        console.log(err);
                    }
                })
            } else if (pickedRate === 0) {
                unRateBook(pickedBook.id, userId, accessToken)
                    .then((obj) => {
                        console.log("unrated");
                        setNumReviewedBooks(numReviewedBooks - 1);
                    })
                    .catch((err) => {
                        if (err instanceof AuthorizationError) {
                            Logout(setIsAuth, setAccessToken, setUserId, setNumReviewedBooks);
                            console.log(err);
                        }
                    })
                getRatedBooks(userId, accessToken)
                    .then((obj) => {
                        setBooks(obj.items);
                    }).catch((err) => {
                    if (err instanceof AuthorizationError) {
                        Logout(setIsAuth, setAccessToken, setUserId, setNumReviewedBooks);
                        console.log(err);
                    }
                })
            }
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <BookInfo book={pickedBook}/>
                <h3>Rate this book: </h3>
                <Rating
                    size="large"
                    name="simple-controlled"
                    value={pickedRate}
                    precision={0.5}
                    onChange={(event, newValue) => {
                        setPickedRate(newValue);
                    }}
                />
                <MyButton onClick={() => {
                    setPickedRate(0);
                }}>Unrate</MyButton>
            </div>
        </MyModal>
    );
}

export default BookPopup;