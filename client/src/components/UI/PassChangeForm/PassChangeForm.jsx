import React, {useContext, useRef} from 'react';
import {changePassword} from "../../../utils/backendAPI";
import MyInput from "../Input/MyInput";
import MyButton from "../Button/MyButton";
import {AuthContext} from "../../../context";

function PassChangeForm({setVisible}) {
    const {userId} = useContext(AuthContext);
    const oldPassRef = useRef(null);
    const newPassRef = useRef(null);

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            setVisible(false);
            changePassword({
                user_id: userId,
                old_password: oldPassRef.current.value,
                new_password: newPassRef.current.value
            })
                .then(resp => {
                    resp.status === 404 && alert("Wrong password");
                    resp.status === 200 && alert("Password changed");
                })
        }}>
            <MyInput ref={oldPassRef} type='password' placeholder={'Enter old password'}/>
            <MyInput ref={newPassRef} type='password' placeholder={'Enter new password'}/>
            <MyButton>ChangePassword</MyButton>
        </form>
    );
}

export default PassChangeForm;