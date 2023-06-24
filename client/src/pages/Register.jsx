import React, {useState} from "react";
import MyInput from "../components/UI/Input/MyInput";
import MyButton from "../components/UI/Button/MyButton";
import style from '../styles/Modal.module.css'
import {useNavigate} from "react-router-dom";

const Register = () => {
    const [user, setUser] = useState({login:'', password:''})
    const navigate = useNavigate();
    const register = () => {
        navigate('/login');
    }

    return (
        <div className={style.modal}>
            <h1>Register</h1>
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
            <MyButton onClick={register}>Register</MyButton>
        </div>
    )
}
export default Register;