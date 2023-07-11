import React, {useContext, useRef, useState} from 'react';
import {changePassword} from "../../../utils/backendAPI";
import MyInput from "../Input/MyInput";
import MyButton from "../Button/MyButton";
import {AuthContext} from "../../../context";
import styles from "../../../styles/Login.module.css";

function PassChangeForm({setVisible}) {
    const {userId} = useContext(AuthContext);
    const oldPassRef = useRef(null);
    const newPassRef = useRef(null);

    const [isInvalidPassword, setIsInvalidPassword] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [inputStyle, setInputStyle] = useState({});
    const isInvalidPasswordStyle = {background:"rgba(248,24,84,0.49)"}

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms * 1000));
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            changePassword({
                user_id: userId,
                old_password: oldPassRef.current.value,
                new_password: newPassRef.current.value
            })
                .then(async resp => {
                    if (resp.status === 404) {
                        setVisible(true);
                        setIsInvalidPassword(true);
                        setInputStyle(isInvalidPasswordStyle);
                    } else {
                        setIsInvalidPassword(false);
                        setIsSaved(true);
                        await sleep(1);
                        setVisible(false);
                    }
                })
        }}>
            <MyInput ref={oldPassRef} type='password' placeholder={'Enter old password'}/>
            <MyInput ref={newPassRef} type='password' placeholder={'Enter new password'}/>
            {isInvalidPassword &&
                <div className={styles.notUserFound}>
                    Old password is invalid
                    <br/>
                </div>
            }
            {isSaved &&
                <div className={styles.userCreated}>
                    Saved
                    <br/>
                </div>
            }
            <MyButton>ChangePassword</MyButton>
        </form>
    );
}

export default PassChangeForm;