import React, {useContext, useRef, useState} from 'react';
import MyInput from "../Input/MyInput";
import Dropdown from "../Dropdown/Dropdown";
import {AuthContext} from "../../../context";
import style from './BookSearch.module.css'
import {getBooks} from "../../../utils/backendAPI";

function BookSearch({placeholder}) {
    const [booksArr, setBooksArr] = useState([]);
    const [visible, setVisible] = useState(false);
    const {accessToken} = useContext(AuthContext);
    const bookNameRef = useRef();

    return (
        <div className={style.bookSearch} onClick={() => setVisible(false)}>
            <MyInput
                placeholder={placeholder}
                ref={bookNameRef}
                onChange={() => {
                    getBooks(bookNameRef.current.value, accessToken)
                        .then(books => setBooksArr(books.items))
                }}
                onClick={(e) => e.stopPropagation()}
                onFocus={() => setVisible(true)}
            />
            {visible && bookNameRef.current.value &&
                <Dropdown onClick={(e) => e.stopPropagation()} booksArr={booksArr}/>}
        </div>
    );
}

export default BookSearch;