import React, {useContext, useMemo} from 'react';
import {UserContext} from "../../../context";
import EmptyCover from "../EmptyCover/EmptyCover";
import style from "./BooksGrid.module.css"
import LoadingSpinner from "../LoadingSpinner/Spinner";
import {Rating} from "@mui/material";

function BooksGrid({books, header}) {
    console.log('BooksGrid render')
    console.log(`Books number:${books.length}`)
    console.log(books);
    const {isFetchingRatedBooks} = useContext(UserContext);
    return (
        <>
            <div className={style.div_p}>
                <p className={style.p_my_rvw}>{header}</p>
            </div>
            {isFetchingRatedBooks
                ? <div className={style.loadingSpinner}>
                    <LoadingSpinner size="100px"/>
                </div>
                : <div>
                    {books.length === 0 ?
                        <div className={style.noBooksDiv}>
                            <p>No books</p>
                        </div>
                        :
                        <div className={style.grid}>
                            {books.map((book) => (
                                <div key={book.id} className={style.book}>
                                    <div className={style.coverImg}>
                                        {book.image_url_m !== "http://127.0.0.1:8080/static/emptyCoverM.png"
                                            ? <img src={book.image_url_m} alt={book.title} className={style.img}/>
                                            : <EmptyCover name={book.title} size='M'/>
                                        }
                                    </div>
                                    {console.log(book.rating)}
                                    <div className={style.rating}>
                                        <Rating
                                            name="read-only"
                                            value={book.rating/2}
                                            precision={0.5}
                                            readOnly={true}
                                        />
                                    </div>

                                </div>
                            ))}
                        </div>
                    }
                </div>
            }
        </>

    );
}

export default BooksGrid;