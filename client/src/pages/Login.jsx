import React, {useContext} from "react";
import {Link, Navigate} from "react-router-dom";
import MyInput from "../components/UI/Input/MyInput";
import MyButton from "../components/UI/Button/MyButton";
import styles from '../styles/Modal.module.css'
import {AuthContext} from "../context";

const Login = () => {
    const {isAuth, setIsAuth} = useContext(AuthContext);

    const login = event => {
        event.preventDefault()
        setIsAuth(true);
        console.log(isAuth);
        localStorage.setItem('auth', 'true');
    }

    return (
        <div className={styles.modal}>
            {isAuth && (
                <Navigate to='/welcome' replace={true}/>
            )}
            <h1>Log in!</h1>
            <form className={styles.modalForm} onSubmit={login}>
                <MyInput type="text" placeholder="Username"></MyInput>
                <MyInput type="password" placeholder="Password"></MyInput>
                <MyButton>LogIn</MyButton>
                <Link to="/register">Register</Link>
            </form>
        </div>
    )
}
export default Login;