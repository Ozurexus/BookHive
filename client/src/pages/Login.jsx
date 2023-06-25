import React, {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import MyInput from "../components/UI/Input/MyInput";
import MyButton from "../components/UI/Button/MyButton";
import styles from '../styles/Modal.module.css'
import {AuthContext, BackAddr} from "../context";

const Login = () => {
    const {setIsAuth, setUserId, setAccessToken} = useContext(AuthContext);
    const [user, setUser] = useState({login: '', password: ''});
    const navigate = useNavigate();
    const backAddr = useContext(BackAddr);

    const login = event => {
        event.preventDefault()

        const url = `${backAddr}/auth/users/login`;
        fetch(url, {
            method: "POST",
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(resp => resp.json())
            .then(user => {
                if(user.detail) {
                    alert("Wrong user");
                    setUser({login: '', password: ''});
                } else {
                    setUserId(user['user_id']);
                    setAccessToken(user['jwt']['access_token']);
                    setIsAuth(true);

                    localStorage.setItem('userId', `${user['user_id']}`);
                    localStorage.setItem('accessToken', `${user['jwt']['access_token']}`);
                    localStorage.setItem('auth', 'true');

                    navigate('/welcome');
                }
            })
            .catch(err => console.log(err));
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