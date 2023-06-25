import React, {useContext, useState} from 'react';
import MyInput from "../Input/MyInput";
import Dropdown from "../Dropdown/Dropdown";
import {AuthContext, BackAddr} from "../../../context";
import style from './BookSearch.module.css'
import useLocalStorage from "../../../hooks/useLocalStorage";

function BookSearch({placeholder}) {
    const [bookName, setBookName] = useState('');
    const [booksArr, setBooksArr] = useState([]);
    const backAddr = useContext(BackAddr);
    const {accessToken} = useContext(AuthContext);
    //const [accessToken, ] = useLocalStorage('accessToken', '');
    const getBooks = (e) => {
        const newName = e.target.value
        const url = `${backAddr}/api/books/find/`
        setBookName(newName);
        fetch(url + '?' + new URLSearchParams({pattern: newName.toLowerCase(), limit: 10}), {
            method: "GET",
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        })
            .then(resp => resp.json())
            .then(books => setBooksArr(books.items))
            .catch(err => console.log(err));
    }
    return (
        <div className={style.bookSearch} >
            <MyInput placeholder={placeholder} onChange={getBooks} value={bookName}></MyInput>
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