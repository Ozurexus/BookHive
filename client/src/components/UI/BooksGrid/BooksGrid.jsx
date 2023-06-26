import React, {useContext} from 'react';
import {UserContext} from "../../../context";

function BooksGrid() {
    const {books} = useContext(UserContext);
    console.log(books);

    return (
        <div style={{display:'flex', flexWrap:'wrap'}}>
            {books.map((book) => (
                <div key={book.id} style={{padding:'5px'}}>
                    <img src={book.image_url_m} alt={book.title}/>
                    <p>{book.title}</p>
                </div>
            ))}
        </div>
    );
}

export default BooksGrid;