import React, {useContext, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import MyInput from "../components/UI/Input/MyInput";
import styles from '../styles/Login.module.css'
import {AuthContext} from "../context";
import {login} from "../utils/backendAPI";
import {blue, yellow} from "@mui/material/colors";

const Login = () => {
    const {setIsAuth, setUserId, setAccessToken} = useContext(AuthContext);
    const navigate = useNavigate();

    const logRef = useRef();
    const passRef = useRef();

    const [userExist, setUserExist] = useState(true);
    const [inputStyle, setInputStyle] = useState({});


    const userNotFoundStyle = {background:"rgba(238,34,94,0.49)"}

    return (
        <div className={styles.modal}>
            <h1 className={styles.h1}>Log in!</h1>
            <form className={styles.modalForm} onSubmit={(event) => {
                event.preventDefault();
                login({login:logRef.current.value, password:passRef.current.value})
                    .then(user => {
                        if(user.detail) {
                            setInputStyle(userNotFoundStyle);
                            setUserExist(false);
                            logRef.current.value = '';
                            passRef.current.value = '';
                        } else {
                            setUserId(user['user_id']);
                            setAccessToken(user['jwt']['access_token']);
                            setIsAuth(true);

                            localStorage.setItem('userId', `${user['user_id']}`);
                            localStorage.setItem('accessToken', `${user['jwt']['access_token']}`);
                            localStorage.setItem('auth', 'true');
                            localStorage.setItem('userLogin', `${logRef.current.value}`)
                            navigate('/welcome')
                        }
                    });
            }}>
                <MyInput
                         ref={logRef}
                         type="text"
                         placeholder="Username"
                         style={inputStyle}
                />
                <MyInput
                         ref={passRef}
                         type="password"
                         placeholder="Password"
                         style={inputStyle}
                />
                {!userExist &&
                    <div className={styles.notUserFound}>
                        <p>Not found</p>
                    </div>
                }
                <button className={styles.logInBtn}>Log In</button>
            </form>
            <p className={styles.p}>or</p>
            <Link to="/register" className={styles.regBtn}>Register</Link>
        </div>
    )
}
export default Login;