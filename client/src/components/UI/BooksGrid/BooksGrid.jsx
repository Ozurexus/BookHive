import React, {useContext, useMemo} from 'react';
import {UserContext} from "../../../context";
import EmptyCover from "../EmptyCover/EmptyCover";
import style from "./BooksGrid.module.css"

function BooksGrid() {
    const {books} = useContext(UserContext);
    console.log('BooksGrid render')
    console.log(books);

    return (
        <div className={style.grid}>
            {books.map((book) => (
                <div key={book.id} className={style.book}>
                    <img src={book.image_url_m} alt={book.title}/>
                </div>
            ))}
        </div>
    );
}

export default BooksGrid;