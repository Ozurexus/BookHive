import React, {useContext, useRef, useState} from 'react';
import MyInput from "../Input/MyInput";
import Dropdown from "../Dropdown/Dropdown";
import {AuthContext} from "../../../context";
import style from './BookSearch.module.css'
import {getBooks} from "../../../utils/backendAPI";
import LoadingSpinner from "../LoadingSpinner/Spinner";

function BookSearch({placeholder}) {
    const [booksArr, setBooksArr] = useState([]);
    const [visible, setVisible] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const {accessToken} = useContext(AuthContext);
    const bookNameRef = useRef();

    return (
        <div className={style.bookSearch} onClick={() => setVisible(false)}>
            <MyInput
                placeholder={placeholder}
                ref={bookNameRef}
                onChange={() => {
                    setIsFetching(true);
                    getBooks(bookNameRef.current.value, accessToken)
                        .then(books => {
                            setBooksArr(books.items)
                            setIsFetching(false);
                        })
                }}
                onClick={(e) => e.stopPropagation()}
                onFocus={() => setVisible(true)}
            />
            {visible && bookNameRef.current.value &&
                <Dropdown isFetching={isFetching} onClick={(e) => e.stopPropagation()} booksArr={booksArr}/>}
        </div>
    );
}

export default BookSearch;