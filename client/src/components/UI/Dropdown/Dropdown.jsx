import React, {useContext, useEffect, useState} from 'react';
import style from './Dropdown.module.css'
import MyButton from "../Button/MyButton";
import MyModal from "../MyModal/MyModal";
import {Rating} from '@mui/material';
import {AuthContext, UserContext} from "../../../context";
import {getRatedBooks, rateBook} from "../../../utils/backendAPI";
import EmptyCover from "../EmptyCover/EmptyCover";

function Dropdown({booksArr, ...props}) {
    const [modal, setModal] = useState(false);
    const [pickedBook, setPickedBook] = useState({});
    const [pickedRate, setPickedRate] = useState(0);
    const {userId, accessToken} = useContext(AuthContext);
    const {books, setBooks} = useContext(UserContext);

    useEffect(() => {
        const oldBook = books.find((elem, ind, arr) => elem.id === pickedBook.bookId)
        if (oldBook)
            setPickedRate(oldBook.rating)
        else
            setPickedRate(0);
    }, [pickedBook])


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
        <div className={style.dropdown} {...props}>
            <div className={style.dropdownContent}>
                {booksArr.map((book) =>
                    <div key={book.book_id} className={style.dropdownItem}>
                        <img src={book.image_link_small} alt={'book'}/>
                        <p className={style.prghTitle}>{book.title}</p>
                        <p className={style.prghAuthor}>{book.author}</p>
                        <MyButton onClick={() => showBook(book)}>Rate</MyButton>
                    </div>
                )}
            </div>
            <MyModal visible={modal} setVisible={() => {
                setModal(false);
                if (pickedRate > 0) {
                    rateBook(pickedBook.bookId, pickedRate, userId, accessToken)
                        .then(resp => console.log(resp));
                    getRatedBooks(userId, accessToken)
                        .then((obj) => {
                            setBooks(obj.items);
                        })
                }
            }}>
                <img src={pickedBook.image_link_small} alt={'book'}/>
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