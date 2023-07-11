import React, {useContext} from "react";
import {Link} from "react-router-dom";
import style from './Navbar.module.css'
import {AuthContext} from "../../../context";
import BookSearch from "../Search/BookSearch";
import logo from "./logo.png"

const Navbar = () => {
    const {setIsAuth, setAccessToken, setUserId} = useContext(AuthContext);
    const logout = () => {
        setIsAuth(false);
        setAccessToken('');
        setUserId('');
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
            <div className={style.logout} onClick={logout}>
                <div className={style.logoutTxt}>Log out</div>
            </div>
        </div>
    )
}

export default Navbar;