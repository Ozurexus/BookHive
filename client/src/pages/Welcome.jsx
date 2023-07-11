import React, {useContext, useEffect} from "react";
import Navbar from "../components/UI/Navbar/Navbar";
import style from '../styles/Login.module.css'
import styleWel from '../styles/Welcome.module.css'
import BookSearch from "../components/UI/Search/BookSearch";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../context";


const Welcome = () => {
    const {numReviewedBooks, setNumReviewedBooks} = useContext(AuthContext);

    const navigate = useNavigate();
    useEffect(() => {
        if (numReviewedBooks >= 3) {
            navigate("/mybooks");
        }
    }, [numReviewedBooks])

    return (
        <div className='page'>
            <div className={styleWel.searchModal}>
                <Navbar/>
                <div className={style.modal}>
                    <h1>Welcome! Please rate at least 3 books</h1>
                    <BookSearch placeholder={"Enter book titles to rate"}/>
                </div>
            </div>
        </div>
    )
}

export default Welcome;