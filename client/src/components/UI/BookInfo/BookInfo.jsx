import React, {useContext} from 'react';
import style from "./BookInfo.module.css";
import styleRec from '../../../styles/Recommendations.module.css'
import {Rating} from "@mui/material";
import {AuthContext, UserContext} from "../../../context";
import {addWishBook, AuthorizationError} from "../../../utils/backendAPI";
import {Logout} from "../../../context/util";

function BookInfo({book}) {
    const {wishesBooks, setWishesBooks} = useContext(UserContext);
    const {userId, accessToken, setIsAuth, setAccessToken, setUserId, setNumReviewedBooks} = useContext(AuthContext);

    const getWishListText = (book) => {
        if (wishesBooks.includes(book)) {
            return "Remove from wishlist";
        }
        return "Add to wishlist";
    };

    return (
        <div className={styleRec.bookInfo}>
            <div className={styleRec.book}>
                <img src={book.image_url_l} alt={book.title} className={styleRec.img}/>
                <button className={styleRec.wantToReadBtn} onClick={() => {
                    if (wishesBooks.includes(book)) {
                        setWishesBooks(wishesBooks.filter(wishBook => wishBook !== book));
                    } else {
                        setWishesBooks([...wishesBooks, book]);
                    }
                    addWishBook(book.id, userId, accessToken).then(r => {
                        console.log("Add book:", book.id, "to wishlist of user", userId)
                    }).catch((err) => {
                        if (err instanceof AuthorizationError) {
                            Logout(setIsAuth, setAccessToken, setUserId, setNumReviewedBooks);
                            console.log(err);
                        }
                    })
                }}>{getWishListText(book)}
                </button>
            </div>



            <div className={style.container}>

                <div className={style.info}>
                    <h2 className={style.h2}>{book.title}</h2>
                    <h2 className={style.h2}>{book.author}</h2>
                    <h3 className={style.h3}>Genre: {book.genre}</h3>
                    <br/>
                    <div className={style.ratingAndP}>
                        <h3>Average rating: &nbsp;</h3>
                        <Rating
                            name="read-only"
                            value={book.rating}
                            precision={0.5}
                            readOnly={true}
                        />
                    </div>
                    <br/>
                    <h3 className={style.h3}>Annotation</h3>
                    <div className={style.p}>
                        <p>{book.annotation}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookInfo;