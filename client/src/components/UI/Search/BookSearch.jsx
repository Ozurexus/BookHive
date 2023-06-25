import React, {useContext, useState} from 'react';
import MyInput from "../Input/MyInput";
import Dropdown from "../Dropdown/Dropdown";
import {AuthContext} from "../../../context";
import style from './BookSearch.module.css'
import {getBooks} from "../../../utils/backendAPI";

function BookSearch({placeholder}) {
    const [bookName, setBookName] = useState('');
    const [booksArr, setBooksArr] = useState([]);
    const {accessToken} = useContext(AuthContext);
    //const [accessToken, ] = useLocalStorage('accessToken', '');

    return (
        <div className={style.bookSearch}>
            <MyInput placeholder={placeholder} onChange={(e) => {
                const newName = e.target.value;
                setBookName(newName);
                getBooks(newName, accessToken)
                    .then(books => setBooksArr(books.items))
            }} value={bookName}></MyInput>
            {bookName
                ?
                <Dropdown booksArr={booksArr}/>
                :
                <> </>
            }
        </div>
    );
}

export default BookSearch;