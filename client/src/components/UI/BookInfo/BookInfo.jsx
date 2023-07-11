import React, {useContext, useRef, useState} from 'react';
import style from "./BookInfo.module.css";
import {Rating} from "@mui/material";
import {getRatedBooks, rateBook} from "../../../utils/backendAPI";
import {AuthContext, UserContext} from "../../../context";

function BookInfo({book}) {
    const [rate, setRate] = useState(0);
    const {userId, accessToken} = useContext(AuthContext);
    const {setBooks} = useContext(UserContext);
    return (
        <div className={style.container}>
            <div className={style.info}>
                <Rating
                    name="read-only"
                    value={book.rating}
                    precision={0.5}
                    readOnly={true}
                />
                <h2 className={style.h2}>{book.title}</h2>
                <h2 className={style.h2}>{book.author}</h2>
                <h3 className={style.h3}>Genre: {book.genre}</h3>
                <h3 className={style.h3}>Annotation</h3>
                <div className={style.p}>
                    <p>{book.annotation}</p>
                </div>
            </div>
        </div>
    );
}

export default BookInfo;