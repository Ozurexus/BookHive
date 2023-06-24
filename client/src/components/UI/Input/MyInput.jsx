import React from "react";
import style from './MyInput.module.css';

const MyInput = (props) => {
    return (
        <input className={style.myInput} {...props}/>
    )
}

export default MyInput;