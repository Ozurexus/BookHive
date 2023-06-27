import React, {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import MyInput from "../components/UI/Input/MyInput";
import MyButton from "../components/UI/Button/MyButton";
import styles from '../styles/Login.module.css'
import {AuthContext} from "../context";
import {login} from "../utils/backendAPI";

const Login = () => {
    const {setIsAuth, setUserId, setAccessToken} = useContext(AuthContext);
    const [user, setUser] = useState({login: '', password: ''});
    const navigate = useNavigate();

    return (
        <div className={styles.modal}>
            <h1>Log in!</h1>
            <form className={styles.modalForm} onSubmit={(event) => {
                event.preventDefault();
                login(user)
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
                        }
                    })
                    .then(() => {
                        localStorage.setItem('userLogin', `${user.login}`)
                        navigate('/welcome')
                    });
            }}>
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