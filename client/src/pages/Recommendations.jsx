import React, {useContext} from "react";
import Navbar from "../components/UI/Navbar/Navbar";
import {AuthContext, UserContext} from "../context";
import style from "../styles/Recommendations.module.css"
import EmptyCover from "../components/UI/EmptyCover/EmptyCover";
import {addWishBook} from "../utils/backendAPI";
import BookInfo from "../components/UI/BookInfo/BookInfo";

const Recommendations = () => {
    const {recBooks, wishesBooks, setWishesBooks} = useContext(UserContext);
    const {userId, accessToken} = useContext(AuthContext);

    return (
        <div className={'page'}>
            <Navbar></Navbar>
            <div className={style.container}>
                {recBooks.map((book) => (
                    <div key={book.id} className={style.book}>
                        <BookInfo book={book}/>
                        <button className={style.wantToReadBtn} onClick={() => {
                            if(!wishesBooks.includes(book)) {
                                alert(`You add "${book.title}" to your wishlist!`);
                                setWishesBooks([...wishesBooks, book]);
                                addWishBook(book.id, userId, accessToken).then(r => {
                                    console.log("Add book:", book.id, "to wishlist of user", userId)
                                })
                            }
                        }}>Want to read
                        </button>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Recommendations;