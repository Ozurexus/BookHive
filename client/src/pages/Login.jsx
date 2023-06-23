import React from "react";
import { Link } from "react-router-dom";
import MyInput from "../components/UI/Input/MyInput";
import MyButton from "../components/UI/Button/MyButton";
import styles from '../styles/Modal.module.css'

const Login = () => {
    return (
        <div className={styles.modal}>
            <h1>Log in!</h1>
            <form className={styles.modalForm}>
                <MyInput type="text" placeholder="Username"></MyInput>
                <MyInput type="password" placeholder="Password"></MyInput>
                <MyButton>LogIn</MyButton>
                <Link to="/register">Register</Link>
            </form>
        </div>
    )
}
export default Login;