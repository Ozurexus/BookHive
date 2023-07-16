import React, {useContext, useEffect, useState} from 'react';
import {AuthContext, UserContext} from "../../../context";
import EmptyCover from "../EmptyCover/EmptyCover";
import style from "./BooksGrid.module.css"
import LoadingSpinner from "../LoadingSpinner/Spinner";
import {Rating} from "@mui/material";
import {addWishBook, AuthorizationError, getRatedBooks, rateBook, unRateBook} from "../../../utils/backendAPI";
import {Logout} from "../../../context/util";
import BookInfo from "../BookInfo/BookInfo";
import MyButton from "../Button/MyButton";
import MyModal from "../MyModal/MyModal";

function BooksGrid({books, header}) {
    console.log('BooksGrid render')
    console.log(`Books number:${books.length}`)
    console.log("Grid books: ", books);

    const [modal, setModal] = useState(false);
    const [pickedBook, setPickedBook] = useState({rating: 0});
    const [pickedRate, setPickedRate] = useState(-1);
    const [prevPickedRate, setPrevPickedRate] = useState(-1);

    useEffect(() => {
        const oldBook = books.find((elem, ind, arr) => elem.id === pickedBook.id)
        //console.log(oldBook)
        if (oldBook) {
            setPickedRate(oldBook.rating / 2);
            setPrevPickedRate(oldBook.rating / 2);
        } else {
            setPickedRate(-1);
            setPrevPickedRate(-1);
        }
    }, [pickedBook])

    const {isFetchingRatedBooks, wishesBooks, setWishesBooks, recBooks} = useContext(UserContext);
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

    const getWishListText = (book) => {
        if (wishesBooks.includes(book)) {
            return "Remove";
        }
        return "Add to wishlist";
    };

    const showBook = (book) => {
        setModal(true);
        setPickedBook(book);
    }
    return (
        <>
            <div className={style.div_p}>
                <p className={style.p_my_rvw}>{header}</p>
            </div>
            {isFetchingRatedBooks
                ? <div className={style.loadingSpinner}>
                    <LoadingSpinner size="100px"/>
                </div>
                : <div>
                    {books.length === 0 ?
                        <div className={style.noBooksDiv}>
                            <p>No books</p>
                        </div>
                        :
                        <div className={style.grid}>
                            {books.map((book) => (
                                <div key={book.id} className={style.book} onClick={() => {
                                    showBook(book);
                                }}>
                                    <div className={style.coverImg}>
                                        {book.image_url_m !== "http://127.0.0.1:8080/static/emptyCoverM.png"
                                            ? <img src={book.image_url_m} alt={book.title} className={style.img}/>
                                            : <EmptyCover name={book.title} size='M'/>
                                        }
                                    </div>
                                    {header === "My reviews" &&
                                        <div className={style.rating}>
                                            <Rating
                                                name="read-only"
                                                value={book.rating / 2}
                                                precision={0.5}
                                                readOnly={true}
                                            />
                                        </div>
                                    }
                                    {header === "Wishlist" &&
                                        <button className={style.wantToReadBtn} onClick={() => {
                                            if (wishesBooks.includes(book)) {
                                                setWishesBooks(wishesBooks.filter(wishBook => wishBook !== book));
                                            } else {
                                                setWishesBooks([...wishesBooks, book]);
                                            }
                                            addWishBook(book.id, userId, accessToken).then(r => {
                                                console.log("Add book:", book.id, "to wishlist of user", userId)
                                            })
                                        }}>{getWishListText(book)}
                                        </button>}
                                </div>
                            ))}

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
            }

        </>

    )
        ;
}

export default BooksGrid;