import React, {useContext, useState} from 'react';
import MyInput from "../Input/MyInput";
import Dropdown from "../Dropdown/Dropdown";
import {AuthContext} from "../../../context";
import style from './BookSearch.module.css'
import {getBooks} from "../../../utils/backendAPI";

function BookSearch({placeholder}) {
    const [bookName, setBookName] = useState('');
    const [booksArr, setBooksArr] = useState([]);
    const [visible, setVisible] = useState(false);
    const {accessToken} = useContext(AuthContext);

    return (
        <div className={style.bookSearch} onClick={() => setVisible(false)}>
            <MyInput placeholder={placeholder} onChange={(e) => {
                const newName = e.target.value;
                setBookName(newName);
                getBooks(newName, accessToken)
                    .then(books => setBooksArr(books.items))
            }} onClick={(e) => e.stopPropagation()} onFocus={() => setVisible(true)} value={bookName}></MyInput>
            {visible && bookName && <Dropdown onClick={(e) => e.stopPropagation()} booksArr={booksArr}/>}
        </div>
    );
}

export default BookSearch;