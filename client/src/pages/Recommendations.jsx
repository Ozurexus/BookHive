import React, {useContext} from "react";
import Navbar from "../components/UI/Navbar/Navbar";
import {AuthContext, UserContext} from "../context";
import style from "../styles/Recommendations.module.css"
import EmptyCover from "../components/UI/EmptyCover/EmptyCover";
import {addWishBook} from "../utils/backendAPI";

const Recommendations = () => {
    const {recBooks, wishesBooks, setWishesBooks} = useContext(UserContext);
    const {userId, accessToken} = useContext(AuthContext);

    return (
        <div className={'page'}>
            <Navbar></Navbar>
            <div className={style.container}>
                {recBooks.map((book) => (
                    <div key={book.id} className={style.book}>
                        {book.image_url_l !== "http://127.0.0.1:8080/static/emptyCoverL.png"
                            ? <img src={book.image_url_l} alt={book.title} className={style.img}/>
                            : <EmptyCover name={book.title} size='L'/>
                        }
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