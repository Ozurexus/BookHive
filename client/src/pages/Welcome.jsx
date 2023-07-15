import React, {useContext, useEffect} from "react";
import Navbar from "../components/UI/Navbar/Navbar";
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
    const inputStyle = {
        border: '30px solid rgb(250, 192, 41)',

    }
    return (
        <div className='page'>
            <img className={styleWel.cuteCat} src='/cuteCat.svg'/>
            <img className={styleWel.bookcase} src='/bookcase.svg'/>
            <div className={styleWel.searchModal}>
                <Navbar/>
                <div>
                    <h1>Welcome! Please rate at least 3 books</h1>
                    <BookSearch placeholder={"Enter book titles to rate"} inputStyle={inputStyle}/>
                </div>
            </div>
        </div>
    )
}

export default Welcome;