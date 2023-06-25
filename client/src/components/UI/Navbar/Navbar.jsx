import React, {useContext} from "react";
import {Link} from "react-router-dom";
import style from './Navbar.module.css'
import MyButton from "../Button/MyButton";
import {AuthContext} from "../../../context";
import BookSearch from "../Search/BookSearch";

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

    return (
        <div className={style.navbar}>
            <h1>BookHive</h1>
            <Link to='/recommendations'>RECOMMENDATIONS</Link>
            <Link to='/mybooks'>MYBOOKS</Link>
            <BookSearch placeholder={'BookSearch books'}/>
            <MyButton onClick={logout}>Log Out</MyButton>
        </div>
    )
}

export default Navbar;