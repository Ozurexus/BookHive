import React, {useContext, useMemo, useState} from 'react';
import {Avatar} from "@mui/material";
import style from "../../../styles/AccountInfo.module.css";
import {UserContext} from "../../../context";
import MyModal from "../MyModal/MyModal";
import PassChangeForm from "../PassChangeForm/PassChangeForm";


function AccountInfo(props) {
    const {books, userLogin} = useContext(UserContext);
    const [passVisible, setPassVisible] = useState(false);


    console.log("AccountInfo render")
    let status = "Cool guy";
    return (
        <div className={style.accountInfo}>
            <div className={style.accountInfoWithoutStatus}>
                <div className={style.avatar}>
                    <Avatar alt="Remy Sharp" src="/avatar_image.png" sx={{width: 100, height: 100}}/>
                </div>
                <div className={style.info}>
                    <div className={style.name}>
                        <p>{userLogin}</p>
                    </div>
                    <div className={style.n_reviewed}>
                        <p>Books reviewed: {books.length}</p>
                    </div>
                </div>
            </div>
            <div className={style.status}>
                <p>Status: {status}</p>
            </div>
            <div className={style.chPassBtnDiv}>
                <button className={style.chPassBtn} onClick={() => setPassVisible(true)}>Change password</button>
                {passVisible &&
                    <MyModal visible={passVisible} setVisible={() => setPassVisible(false)}>
                        <PassChangeForm setVisible={() => setPassVisible(false)}/>
                    </MyModal>
                }
            </div>
        </div>
    );
}

export default AccountInfo;