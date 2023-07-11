import React, {useContext} from "react";
import Navbar from "../components/UI/Navbar/Navbar";
import {AuthContext, UserContext} from "../context";
import style from "../styles/Recommendations.module.css"
import EmptyCover from "../components/UI/EmptyCover/EmptyCover";
import {addWishBook} from "../utils/backendAPI";
import BookInfo from "../components/UI/BookInfo/BookInfo";
import Loader from "../components/UI/Loader/Loader";
import LoadingSpinner from "../components/UI/LoadingSpinner/Spinner";

const Recommendations = () => {
    const {recBooks, wishesBooks, setWishesBooks, isFetchingRecommendations} = useContext(UserContext);
    const {userId, accessToken} = useContext(AuthContext);

    const getWishListText = (book) => {
        if (wishesBooks.includes(book)) {
            return "Remove from wishlist";
        }
        return "Add to wishlist";
    };
    return (
        <div className={'page'}>
            <Navbar></Navbar>
            <div className={style.container}>
                {isFetchingRecommendations &&
                    <div className={style.loadingSpinner}>
                        <LoadingSpinner size="150px"/>
                    </div>
                }
                {recBooks.map((book) => (
                    <div key={book.id} className={style.bookInfo}>
                        <div className={style.book}>
                            <img src={book.image_url_l} alt={book.title} className={style.img}/>
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
                            </button>
                        </div>
                        <BookInfo book={book}/>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Recommendations;