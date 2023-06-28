import React, {useContext} from "react";
import Navbar from "../components/UI/Navbar/Navbar";
import {UserContext} from "../context";
import style from "../styles/Recommendations.module.css"
import EmptyCover from "../components/UI/EmptyCover/EmptyCover";

const Recommendations = () => {
    const {books} = useContext(UserContext); // Here should be recommended books
    const coverExist = (url) => {
        const rand = Boolean(Math.round(Math.random()));
        return rand;
    }
    return (
        <div className={'page'}>
            <Navbar></Navbar>
            <div className={style.container}>
                {books.map((book) => (
                    <div key={book.id} className={style.book}>
                        {coverExist(book.image_url_l)
                            ? <img src={book.image_url_l} alt={book.title}/>
                            : <EmptyCover name={book.title} size="L"/>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Recommendations;