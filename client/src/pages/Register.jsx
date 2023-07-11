import React, {useRef, useState} from "react";
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

    const [userAlreadyExist, setUserAlreadyExist] = useState(false);
    const [inputStyle, setInputStyle] = useState({});
    const userAlreadyExistsStyle = {background: "rgba(253,45,101,0.41)"}

    const [userCreated, setUserCreated] = useState(false);
    const userCreatedStyle = {background: "rgba(51,255,61,0.49)"}

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms * 1000));
    }

    return (
        <div className={style.modal}>
            <h1>Register</h1>
            <form className={styles.modalForm} onSubmit={(e) => {
                e.preventDefault();
                register({login: logRef.current.value, password: passRef.current.value})
                    .then(async newUser => {
                        if (newUser.detail) {
                            setUserAlreadyExist(true);
                            setInputStyle(userAlreadyExistsStyle);
                        } else {
                            setUserAlreadyExist(false);
                            setInputStyle(userCreatedStyle);
                            setUserCreated(true);
                            await sleep(1)
                            navigate('/login');
                        }
                    })
            }}>
                <MyInput
                    ref={logRef}
                    type="text"
                    placeholder="Login"
                    style={inputStyle}
                />
                <MyInput
                    ref={passRef}
                    type="password"
                    placeholder="New Password"
                    style={inputStyle}
                />
                {userAlreadyExist &&
                    <div className={styles.notUserFound}>
                        <p className={styles.pError}>User already exists</p>
                        <br/>
                    </div>
                }
                {userCreated &&
                    <div>
                        <p className={styles.userCreated}>User created</p>
                        <br/>
                    </div>
                }
                <MyButton>Register</MyButton>
            </form>
        </div>
    )
}
export default Register;