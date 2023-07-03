import React, {useContext} from "react";
import Navbar from "../components/UI/Navbar/Navbar";
import {UserContext} from "../context";
import style from "../styles/Recommendations.module.css"
import EmptyCover from "../components/UI/EmptyCover/EmptyCover";

const Recommendations = () => {
    const {recBooks} = useContext(UserContext);


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
                        <button className={style.wantToReadBtn}>Want to read</button>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Recommendations;