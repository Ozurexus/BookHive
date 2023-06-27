import React, {useContext} from "react";
import {Link} from "react-router-dom";
import style from './Navbar.module.css'
import MyButton from "../Button/MyButton";
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
    }
    const linkStyle = {
        display: "contents",
        textDecoration: 'none',
        color: 'black',
        fontWeight: "bold",
    }
    return (
        <div className={style.navbar}>
            <div className={style.logo}>
                <img src={logo} alt="Logo?" className={style.logoimage}/>
            </div>
            <div className={style.header}>
                <h1>BookHive</h1>
            </div>
            <div className={style.recommendations}>
                <Link to='/recommendations' style={linkStyle}>
                    <div className={style.link}>RECOMMENDATIONS</div>
                </Link>
            </div>
            <div className={style.mybooks}>
                <Link to='/mybooks' style={linkStyle}>
                    <div className={style.link}>MY BOOKS</div>
                </Link>
            </div>
            <div className={style.booksearch}>
                <BookSearch placeholder={'BookSearch books'}/>
            </div>
            <div className={style.logout} onClick={logout}>
                <div className={style.logoutTxt}>Log out</div>
            </div>
        </div>
    )
}

export default Navbar;