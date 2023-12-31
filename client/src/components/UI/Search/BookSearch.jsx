import React, {useContext, useRef, useState} from 'react';
import MyInput from "../Input/MyInput";
import Dropdown from "../Dropdown/Dropdown";
import {AuthContext} from "../../../context";
import style from './BookSearch.module.css'
import {AuthorizationError, getBooks} from "../../../utils/backendAPI";
import useComponentVisible from "../Dropdown/util";
import {Logout} from "../../../context/util";

function BookSearch({placeholder, inputStyle}) {
    const [booksArr, setBooksArr] = useState([]);
    const [visible, setVisible] = useState(false);
    const [fetches, setFetches] = useState(false);
    const {accessToken, setIsAuth, setAccessToken, setUserId, setNumReviewedBooks} = useContext(AuthContext);
    const bookNameRef = useRef();
    const {ref, isComponentVisible, setIsComponentVisible} = useComponentVisible(true);

    return (
        <div className={style.bookSearch} onClick={() => setVisible(false)}>
            <MyInput
                placeholder={placeholder}
                style={inputStyle}
                ref={bookNameRef}
                onChange={() => {
                    setFetches(true);
                    setBooksArr([]);
                    getBooks(bookNameRef.current.value, accessToken)
                        .then(books => {
                            //console.log(books);
                            if (books.items !== undefined)
                                setBooksArr(books.items);
                            setFetches(false);
                        })
                        .catch((err) => {
                            if (err instanceof AuthorizationError) {
                                Logout(setIsAuth, setAccessToken, setUserId, setNumReviewedBooks);
                                console.log(err);
                            }
                        })
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsComponentVisible(true);
                }}
                onFocus={() => setVisible(true)}
            />
            {visible && bookNameRef.current.value &&
                <Dropdown refOutside={ref} isComponentVisible={isComponentVisible} fetches={fetches}
                          onClick={(e) => e.stopPropagation()} booksArr={booksArr}/>}
        </div>
    );
}

export default BookSearch;