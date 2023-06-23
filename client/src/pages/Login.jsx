import React, {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import MyInput from "../components/UI/Input/MyInput";
import MyButton from "../components/UI/Button/MyButton";
import styles from '../styles/Modal.module.css'
import {AuthContext} from "../context";

const Login = () => {
    const {isAuth, setIsAuth} = useContext(AuthContext);
    const [user, setUser] = useState({login: '', password: ''});

    const navigate = useNavigate();

    const login = event => {
        event.preventDefault()
        setIsAuth(true);
        console.log(isAuth);
        localStorage.setItem('auth', 'true');
        navigate('/welcome');
    }

    return (
        <div className={styles.modal}>
            <h1>Log in!</h1>
            <form className={styles.modalForm} onSubmit={login}>
                <MyInput value={user.login}
                         onChange={e => setUser({
                             ...user,
                             login: e.target.value
                         })}
                         type="text"
                         placeholder="Username" />
                <MyInput value={user.password}
                         onChange={e => setUser({
                             ...user,
                             password: e.target.value
                         })}
                         type="password"
                         placeholder="Password" />
                <MyButton>LogIn</MyButton>
            </form>
            <Link to="/register">Register</Link>
        </div>
    )
}
export default Login;