import React from "react";
import MyInput from "../components/UI/Input/MyInput";
import MyButton from "../components/UI/Button/MyButton";
import style from '../styles/Modal.module.css'

const Register = () => {
    return (
        <div className={style.modal}>
            <h1>Register</h1>
            <MyInput type="text" placeholder="Username"></MyInput>
            <MyInput type="password" placeholder="New Password"></MyInput>
            <MyButton>Register</MyButton>
        </div>
    )
}
export default Register;