import React, {useRef} from "react";
import MyInput from "../components/UI/Input/MyInput";
import MyButton from "../components/UI/Button/MyButton";
import style from '../styles/Login.module.css'
import styles from '../styles/Login.module.css'
import {useNavigate} from "react-router-dom";
import {register} from "../utils/backendAPI";

const Register = () => {
    const logRef = useRef();
    const passRef = useRef();
    const navigate = useNavigate();

    return (
        <div className={style.modal}>
            <h1>Register</h1>
            <form className={styles.modalForm} onSubmit={(e) => {
                e.preventDefault();
                register({login: logRef.current.value, password: passRef.current.value})
                    .then(newUser => {
                        if (newUser.detail)
                            alert('User alerady exists')
                        else {
                            alert('User created');
                            navigate('/login');
                        }
                    })
            }}>
                <MyInput
                    ref={logRef}
                    type="text"
                    placeholder="Login"/>
                <MyInput
                    ref={passRef}
                    type="password"
                    placeholder="New Password"/>
                <MyButton>Register</MyButton>
            </form>
        </div>
    )
}
export default Register;