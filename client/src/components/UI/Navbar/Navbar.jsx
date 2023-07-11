import React, {useContext, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import style from './Navbar.module.css'
import {AuthContext} from "../../../context";
import BookSearch from "../Search/BookSearch";
import logo from "./logo.png"

const Navbar = () => {
    const {setIsAuth, setAccessToken, setUserId, numReviewedBooks, setNumReviewedBooks} = useContext(AuthContext);
    const navigate = useNavigate();

    const logout = () => {
        setIsAuth(false);
        setAccessToken('');
        setUserId('');
        setNumReviewedBooks(0);
        localStorage.removeItem('auth');
        localStorage.removeItem('userId');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userLogin');
    }
    return (
        <div className={style.navbar}>
            <div className={style.logo}>
                <img src={logo} alt="Logo?" className={style.logoimage}/>
                <h1 className={style.h_logo}>BookHive</h1>
            </div>
            {numReviewedBooks >= 3 &&
                <>
                    <div className={style.recommendations}>
                        <Link to='/recommendations'>
                            <div className={style.link}>RECOMMENDATIONS</div>
                        </Link>
                    </div>
                    <div className={style.mybooks}>
                        <Link to='/mybooks'>
                            <div className={style.link}>MY BOOKS</div>
                        </Link>
                    </div>
                    <div className={style.booksearch}>
                        <BookSearch placeholder={'Search books'}/>
                    </div>
                </>
            }

            <div className={style.logout} onClick={logout}>
                <Link to='/login'>
                    <div className={style.link_logout}>Logout</div>
                </Link>
            </div>
        </div>
    )
}

export default Navbar;