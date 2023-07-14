import React, {useContext} from 'react';
import {AuthorizationError, getRatedBooks, rateBook} from "../../../utils/backendAPI";
import {Logout} from "../../../context/util";
import {Rating} from "@mui/material";
import MyModal from "../MyModal/MyModal";
import {AuthContext, UserContext} from "../../../context";

function BookPopup({modal, setModal, pickedRate, setPickedRate, pickedBook}) {
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
            setModal(false);
            if (pickedRate > 0) {
                rateBook(pickedBook.bookId, pickedRate * 2, userId, accessToken)
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
            }
        }}>
            <img src={pickedBook.image_url_s} alt={'book'}/>
            <p>{pickedBook.title}</p>
            <p>by {pickedBook.author}</p>
            <Rating
                name="simple-controlled"
                value={pickedRate}
                precision={0.5}
                onChange={(event, newValue) => {
                    setPickedRate(newValue);
                }}
            />
        </MyModal>
    );
}

export default BookPopup;