import React, {useContext, useEffect, useState} from 'react';
import style from './Dropdown.module.css'
import MyButton from "../Button/MyButton";
import MyModal from "../MyModal/MyModal";
import {Rating} from '@mui/material';
import {AuthContext, UserContext} from "../../../context";
import {AuthorizationError, getRatedBooks, rateBook, unRateBook} from "../../../utils/backendAPI";
import EmptyCover from "../EmptyCover/EmptyCover";
import LoadingSpinner from "../LoadingSpinner/Spinner";
import {Logout} from "../../../context/util";
import BookInfo from "../BookInfo/BookInfo";

function Dropdown({booksArr, refOutside, isComponentVisible, fetches, ...props}) {
    const [modal, setModal] = useState(false);
    const [pickedBook, setPickedBook] = useState({rating: 0});
    const [pickedRate, setPickedRate] = useState(-1);
    const [prevPickedRate, setPrevPickedRate] = useState(-1);
    const {recBooks} = useContext(UserContext);

    const {
        userId,
        accessToken,
        numReviewedBooks,
        setNumReviewedBooks,
        setIsAuth,
        setAccessToken,
        setUserId
    } = useContext(AuthContext);
    const {books, setBooks} = useContext(UserContext);


    // clickoutside


    useEffect(() => {
        const oldBook = books.find((elem, ind, arr) => elem.id === pickedBook.id)
        //console.log(oldBook)
        if (oldBook){
            setPickedRate(oldBook.rating / 2);
            setPrevPickedRate(oldBook.rating / 2);
        }
        else{
            setPickedRate(-1);
            setPrevPickedRate(-1);
        }
    }, [pickedBook])


    const showBook = (book) => {
        setModal(true);
        setPickedBook(book);
    }

    return (
        <div className={style.dropdown} {...props}>
            {isComponentVisible &&
                <div ref={refOutside}>
                    <div className={style.dropdownContent}>
                        {fetches &&
                            <div className={style.spinnerDiv}>
                                <LoadingSpinner size="60px"/>
                            </div>
                        }
                        {!fetches && booksArr.length === 0 && <p>No books found</p>}
                        {booksArr.map((book) =>
                            <div key={book.id} className={style.dropdownItem}>
                                <div className={style.imgContainer}>
                                    {book.image_url_s !== "http://127.0.0.1:8080/static/emptyCoverS.png"
                                        ? <img src={book.image_url_s} alt={book.title} className={style.img}/>
                                        : <EmptyCover name={book.title} size='S'/>
                                    }
                                </div>
                                <div className={style.title}>
                                    <p className={style.prghTitle}>{book.title}</p>
                                </div>
                                <div className={style.author}>
                                    <p className={style.prghAuthor}>{book.author}</p>
                                </div>
                                <div className={style.rateBtn}>
                                    <MyButton onClick={() => showBook(book)}>Rate</MyButton>
                                </div>
                            </div>
                        )}
                    </div>
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
                </div>
            }
        </div>
    );
}

export default Dropdown;