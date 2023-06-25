import React from 'react';
import style from './Dropdown.module.css'

function Dropdown({booksArr}) {
    return (
        <div className={style.dropdown}>
            <div className={style.dropdownContent}>
                {booksArr.map((book) =>
                    <div key={book.book_id} className={style.dropdownItem}>
                        <img src={book.image_link_small}/>
                        <p>{book.title}</p>
                        <p>by {book.author}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dropdown;