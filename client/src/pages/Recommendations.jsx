import React, {useContext} from "react";
import Navbar from "../components/UI/Navbar/Navbar";
import {UserContext} from "../context";
import style from "../styles/Recommendations.module.css"

const Recommendations = () => {
    const {recBooks} = useContext(UserContext);


    return (
        <div className={'page'}>
            <Navbar></Navbar>
            <div className={style.container}>
                {recBooks.map((book) => (
                    <div key={book.id} className={style.book}>
                        <img src={book.image_url_l} alt={book.title} className={style.img}/>

                        <button className={style.wantToReadBtn}>Want to read</button>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Recommendations;