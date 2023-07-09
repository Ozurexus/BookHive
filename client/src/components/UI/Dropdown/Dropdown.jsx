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
            image_url_s: book.image_url_s,
            title: book.title,
            author: book.author,
            bookId: book.id
        })
    }

    return (
        <div className={style.dropdown} {...props}>
            <div className={style.dropdownContent}>
                {booksArr.map((book) =>
                    <div key={book.id} className={style.dropdownItem}>
                        <div className={style.imgContainer}>
                            {book.image_url_s !== "http://127.0.0.1:8080/static/emptyCoverS.png"
                                ? <img src={book.image_url_s} alt={book.title} className={style.img}/>
                                : <EmptyCover name={book.title} size='S'/>
                            }
                        </div>
                        <div className={style.title}>
                            <p className={style.prghTitle}>{book.title}</p>
                        </div>
                        <div className={style.author}>
                            <p className={style.prghAuthor}>{book.author}</p>
                        </div>
                        <div className={style.rateBtn}>
                            <MyButton onClick={() => showBook(book)}>Rate</MyButton>
                        </div>
                    </div>
                )}
            </div>
            <MyModal visible={modal} setVisible={() => {
                setModal(false);
                if (pickedRate > 0) {
                    rateBook(pickedBook.bookId, pickedRate*2, userId, accessToken)
                        .then(resp => console.log(resp));
                    getRatedBooks(userId, accessToken)
                        .then((obj) => {
                            setBooks(obj.items);
                        })
                }
            }}>
                <img src={pickedBook.image_url_s} alt={'book'}/>
                <p>{pickedBook.title}</p>
                <p>by {pickedBook.author}</p>
                <Rating
                    name="simple-controlled"
                    value={pickedRate}
                    precision={0.5}
                    onChange={(event, newValue) => {
                        setPickedRate(newValue);
                    }}
                />
            </MyModal>

        </div>
    );
}

export default Dropdown;