import React, {useContext, useMemo} from 'react';
import {AuthContext, UserContext} from "../../../context";
import EmptyCover from "../EmptyCover/EmptyCover";
import style from "./BooksGrid.module.css"
import LoadingSpinner from "../LoadingSpinner/Spinner";
import {Rating} from "@mui/material";
import {addWishBook} from "../../../utils/backendAPI";

function BooksGrid({books, header}) {
    console.log('BooksGrid render')
    console.log(`Books number:${books.length}`)
    console.log(books);
    const {isFetchingRatedBooks, wishesBooks, setWishesBooks} = useContext(UserContext);
    const {userId, accessToken} = useContext(AuthContext);
    const getWishListText = (book) => {
        if (wishesBooks.includes(book)) {
            return "Remove";
        }
        return "Add to wishlist";
    };
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
                                <div key={book.id} className={style.book}>
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
                        </div>
                    }
                </div>
            }

        </>

    )
        ;
}

export default BooksGrid;