import React, {useContext, useRef, useState} from 'react';
import MyInput from "../Input/MyInput";
import Dropdown from "../Dropdown/Dropdown";
import {AuthContext} from "../../../context";
import style from './BookSearch.module.css'
import {getBooks} from "../../../utils/backendAPI";
import LoadingSpinner from "../LoadingSpinner/Spinner";
import useComponentVisible from "../Dropdown/util";

function BookSearch({placeholder}) {
    const [booksArr, setBooksArr] = useState([]);
    const [visible, setVisible] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const {accessToken} = useContext(AuthContext);
    const bookNameRef = useRef();
    const {ref, isComponentVisible, setIsComponentVisible} = useComponentVisible(true);

    return (
        <div className={style.bookSearch} onClick={() => setVisible(false)}>
            <MyInput
                placeholder={placeholder}
                ref={bookNameRef}
                onChange={() => {
                    setIsFetching(true);
                    setBooksArr([]);
                    getBooks(bookNameRef.current.value, accessToken)
                        .then(books => {
                            if(books.items)
                                setBooksArr(books.items);
                            setIsFetching(false);
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