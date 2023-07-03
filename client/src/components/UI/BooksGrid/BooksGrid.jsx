import React, {useContext, useMemo} from 'react';
import {UserContext} from "../../../context";
import EmptyCover from "../EmptyCover/EmptyCover";
import style from "./BooksGrid.module.css"

function BooksGrid({books, header}) {
    console.log('BooksGrid render')
    console.log(books);

    return (
        <>
            <div className={style.div_p}>
                <p className={style.p_my_rvw}>{header}</p>
            </div>
            <div className={style.grid}>
                {books.map((book) => (
                    <div key={book.id} className={style.book}>
                        {book.image_url_m !== "http://127.0.0.1:8080/static/emptyCoverM.png"
                        ? <img src={book.image_url_m} alt={book.title} className={style.img}/>
                        : <EmptyCover name={book.title} size='M'/>
                        }
                    </div>
                ))}
            </div>
        </>

    );
}

export default BooksGrid;