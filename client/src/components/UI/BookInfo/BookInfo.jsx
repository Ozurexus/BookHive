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
        <div>
            <img src={book.image_url_l} alt={book.title} className={style.img}/>
            <Rating
                name="no-value"
                value={rate}
                precision={0.5}
                onChange={(event, newValue) => {
                    console.log(newValue);
                    setRate(newValue);
                    rateBook(book.id, newValue*2, userId, accessToken)
                        .then(resp => console.log(resp));
                    getRatedBooks(userId, accessToken)
                        .then((obj) => {
                            setBooks(obj.items);
                        })
                    alert("Book rated");
                }}
            />
            <h2>{book.title}</h2>
            <h2>{book.author}</h2>
            <h3>Genre: {book.genre}</h3>
            <h3>Annotation</h3>
            <p>{book.annotation}</p>
        </div>
    );
}

export default BookInfo;