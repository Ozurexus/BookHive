import React, {useContext} from 'react';
import {UserContext} from "../../../context";
import EmptyCover from "../EmptyCover/EmptyCover";
import style from "./BooksGrid.module.css"
function BooksGrid() {
    const {books} = useContext(UserContext);
    console.log(books);
    const coverExist = (url) => {
        const rand = Boolean(Math.round(Math.random()));
        return rand;
    }
    return (
        <div className={style.grid}>
            {books.map((book) => (
                <div key={book.id} className={style.gridItem}>
                    {coverExist(book.image_url_m)
                    ? <img src={book.image_url_m} alt={book.title}/>
                    : <EmptyCover name={book.title}/>
                    }
                </div>
            ))}
        </div>
    );
}

export default BooksGrid;