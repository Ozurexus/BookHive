import React, {useState} from "react";
import MyInput from "../components/UI/Input/MyInput";
import MyButton from "../components/UI/Button/MyButton";
import style from '../styles/Modal.module.css'
import styles from '../styles/Modal.module.css'
import {useNavigate} from "react-router-dom";
import {register} from "../utils/backendAPI";

const Register = () => {
    const [user, setUser] = useState({login:'', password:''})
    const navigate = useNavigate();

    return (
        <div className={style.modal}>
            <h1>Register</h1>
            <form className={styles.modalForm} onSubmit={(e) => {
                e.preventDefault();
                register(user)
                    .then(newUser => {
                        if(newUser.detail)
                            alert('User alerady exists')
                        else {
                            alert('User created');
                            navigate('/login');
                        }
                    })
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
                         placeholder="New Password" />
                <MyButton>Register</MyButton>
            </form>
        </div>
    )
}
export default Register;