import React, {useContext, useState} from "react";
import MyInput from "../components/UI/Input/MyInput";
import MyButton from "../components/UI/Button/MyButton";
import style from '../styles/Modal.module.css'
import {useNavigate} from "react-router-dom";
import {BackAddr, AuthContext} from "../context";
import styles from "../styles/Modal.module.css";

const Register = () => {
    const [user, setUser] = useState({login:'', password:''})
    const backAddr = useContext(BackAddr)
    const navigate = useNavigate();
    const register = e => {
        e.preventDefault();
        const url = `${backAddr}/auth/users/register`;
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
                if(user.detail)
                    alert('User alerady exists')
                else {
                    alert('User created');
                    navigate('/login');
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className={style.modal}>
            <h1>Register</h1>
            <form className={styles.modalForm} onSubmit={register}>
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