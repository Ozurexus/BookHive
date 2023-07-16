import React, {useContext, useState} from "react";
import Navbar from "../components/UI/Navbar/Navbar";
import AccountInfo from "../components/UI/AccountInfo/AccountInfo";
import style from "../styles/MyBooks.module.css"
import BooksGrid from "../components/UI/BooksGrid/BooksGrid";
import {UserContext} from "../context";

const MyBooks = () => {
    const {books, wishesBooks} = useContext(UserContext);
    const booksInGrid = [books, wishesBooks];
    const [booksType, setBooksType] = useState(0);
    return (
        <div className={"page"}>
            <Navbar/>
            <div className={style.container}>
                <div className={style.leftpanel}>
                    <div className={style.account}>
                        <AccountInfo/>
                    </div>
                    <div className={style.otherOptions}>
                        <button className={booksType===0 ? style.myRevBtnActive : style.myRevBtn} onClick={()=>{setBooksType(0)}}>My reviews</button>
                        <button className={booksType===1 ? style.wantToReadBtnActive : style.wantToReadBtn} onClick={()=>{setBooksType(1)}}>Wishlist</button>
                    </div>
                </div>
                <div className={style.booksgrid}>
                    <BooksGrid books={booksInGrid[booksType]} header={booksType===0 ? "My reviews" : "Wishlist"}/>
                </div>
            </div>
        </div>
    )
}

export default MyBooks;