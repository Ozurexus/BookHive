import React, {useContext} from "react";
import Navbar from "../components/UI/Navbar/Navbar";
import {UserContext} from "../context";
import style from "../styles/Recommendations.module.css"
import BookInfo from "../components/UI/BookInfo/BookInfo";
import LoadingSpinner from "../components/UI/LoadingSpinner/Spinner";

const Recommendations = () => {
    const {recBooks, isFetchingRecommendations} = useContext(UserContext);

    return (
        <div className={'page'}>
            <Navbar></Navbar>
            <div className={style.container}>
                {isFetchingRecommendations &&
                    <div className={style.loadingSpinner}>
                        <LoadingSpinner size="150px"/>
                    </div>
                }
                {recBooks.map((book) => (
                    <div key={book.id}>
                        <BookInfo key={book.id} book={book}/>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Recommendations;