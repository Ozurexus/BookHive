import React, {useContext} from "react";
import { Link } from "react-router-dom";
import style from './Navbar.module.css'
import MyInput from "../Input/MyInput";
import MyButton from "../Button/MyButton";
import {AuthContext} from "../../../context";

const Navbar = () => {
    const {isAuth, setIsAuth} = useContext(AuthContext);
    const logout = () => {
        setIsAuth(false);
        localStorage.removeItem('auth');
    }

    return (
        <div className={style.navbar}>
            <h1>BookHive</h1>
            <Link to='/recommendations'>RECOMMENDATIONS</Link>
            <Link to='/mybooks'>MYBOOKS</Link>
            <MyInput className={style.navbarInput} type="text" placeholder="Search books"></MyInput>
            <MyButton onClick={logout}>Log Out</MyButton>
        </div>
    )
}

export default Navbar;