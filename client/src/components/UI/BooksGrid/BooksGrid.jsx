import React, {useContext, useMemo} from 'react';
import {UserContext} from "../../../context";
import EmptyCover from "../EmptyCover/EmptyCover";
import style from "./BooksGrid.module.css"

function BooksGrid() {
    const {books} = useContext(UserContext);
    /*const booksCashed = useMemo(() =>
        [...books]
    , [books])*/
    console.log('BooksGrid render')
    //console.log(books);
    const coverExist = (url) => {
        const rand = Boolean(Math.round(Math.random()));
        return rand;
    }
    return (
        <div className={style.grid}>
            {books.map((book) => (
                <div key={book.id} className={style.book}>
                    {coverExist(book.image_url_m)
                        ? <img src={book.image_url_m} alt={book.title}/>
                        : <EmptyCover name={book.title} size="M"/>
                    }
                </div>
            ))}
        </div>
    );
}

export default BooksGrid;