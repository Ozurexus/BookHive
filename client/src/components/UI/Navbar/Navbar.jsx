import React from "react";
import { Link } from "react-router-dom";
import style from './Navbar.module.css'
import MyInput from "../Input/MyInput";

const Navbar = () => {
    return (
        <div className={style.navbar}>
            <h1>BookHive</h1>
            <Link to='/recommendations'>RECOMMENDATIONS</Link>
            <Link to='/mybooks'>MYBOOKS</Link>
            <MyInput className={style.navbarInput} type="text" placeholder="Search books"></MyInput>
            <Link to='/login'>LOG OUT</Link>
        </div>
    )
}

export default Navbar;