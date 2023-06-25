import React, {useContext, useState} from 'react';
import style from './Dropdown.module.css'
import MyButton from "../Button/MyButton";
import MyModal from "../MyModal/MyModal";
import {Rating} from '@mui/material';
import {AuthContext} from "../../../context";
import {rateBook} from "../../../utils/backendAPI";

function Dropdown({booksArr}) {
    const [modal, setModal] = useState(false);
    const [pickedBook, setPickedBook] = useState({});
    const [pickedRate, setPickedRate] = useState(0);
    const {userId, accessToken} = useContext(AuthContext);

    const showBook = (book) => {
        setModal(true);
        setPickedBook({
            image_link_small: book.image_link_small,
            title: book.title,
            author: book.author,
            bookId: book.book_id
        })
    }
    return (
        <div className={style.dropdown}>
            <div className={style.dropdownContent}>
                {booksArr.map((book) =>
                    <div key={book.book_id} className={style.dropdownItem}>
                        <img src={book.image_link_small}/>
                        <p>{book.title}</p>
                        <p>by {book.author}</p>
                        <MyButton onClick={() => showBook(book)}>Rate</MyButton>
                    </div>
                )}
            </div>
            <MyModal visible={modal} setVisible={() => {
                setModal(false);
                rateBook(pickedBook.bookId, pickedRate, userId, accessToken)
                    .then(resp => console.log(resp));
            }}>
                <img src={pickedBook.image_link_small}/>
                <p>{pickedBook.title}</p>
                <p>by {pickedBook.author}</p>
                <Rating
                    name="simple-controlled"
                    value={pickedRate}
                    onChange={(event, newValue) => {
                        setPickedRate(newValue);
                    }}
                />
            </MyModal>

        </div>
    );
}

export default Dropdown;