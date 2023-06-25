import React from "react";
import Navbar from "../components/UI/Navbar/Navbar";
import style from '../styles/Modal.module.css'
import styleWel from '../styles/Welcome.module.css'
import BookSearch from "../components/UI/Search/BookSearch";


const Welcome = () => {
    return (
        <div className={styleWel.searchModal}>
            <Navbar/>
            <div className={style.modal}>
                <h1>Welcome! Please rate at least 5 books</h1>
                <BookSearch placeholder={"Enter book titles to rate"}/>
            </div>
        </div>
    )
}

export default Welcome;