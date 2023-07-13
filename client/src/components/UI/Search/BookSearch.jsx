import React, {useContext, useRef, useState} from 'react';
import MyInput from "../Input/MyInput";
import Dropdown from "../Dropdown/Dropdown";
import {AuthContext} from "../../../context";
import style from './BookSearch.module.css'
import {getBooks, AuthorizationError} from "../../../utils/backendAPI";
import LoadingSpinner from "../LoadingSpinner/Spinner";
import useComponentVisible from "../Dropdown/util";
import {Logout} from "../../../context/util";

function BookSearch({placeholder, inputStyle}) {
    const [booksArr, setBooksArr] = useState([]);
    const [visible, setVisible] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
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
                    setIsFetching(true);
                    setBooksArr([]);
                    getBooks(bookNameRef.current.value, accessToken)
                        .then(books => {
                            if (books.items !== undefined)
                                setBooksArr(books.items);
                            setIsFetching(false);
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
                <Dropdown refOutside={ref} isComponentVisible={isComponentVisible} isFetching={isFetching}
                          onClick={(e) => e.stopPropagation()} booksArr={booksArr}/>}
        </div>
    );
}

export default BookSearch;