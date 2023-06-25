import React, {useState} from 'react';
import style from './Dropdown.module.css'
import MyButton from "../Button/MyButton";
import MyModal from "../MyModal/MyModal";
import { Rating } from '@mui/material';

function Dropdown({booksArr}) {
    const [modal, setModal] = useState(false);
    const [pickedBook, setPickedBook] = useState({});
    const [pickedRate, setPickedRate] = useState(0);
    const showBook = (book) => {
        setModal(true);
        setPickedBook({image_link_small: book.image_link_small, title: book.title, author: book.author})
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
            <MyModal visible={modal} setVisible={setModal}>
                <img src={pickedBook.image_link_small}/>
                <p>{pickedBook.title}</p>
                <p>by {pickedBook.author}</p>
                <Rating
                    name="simple-controlled"
                    value={pickedRate}
                    onChange={(event, newValue) => {
                        setPickedRate(newValue);
                        setModal(false);

                    }}
                />
            </MyModal>

        </div>
    );
}

export default Dropdown;