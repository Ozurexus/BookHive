import React from 'react';
import {Avatar} from "@mui/material";
import style from "../../../styles/AccountInfo.module.css";


function AccountInfo(props) {
    let name = "Marat Bulatov";
    let booksreviewed = 5;
    let status = "Cool guy";
    return (<div className={style.accountInfo}>
            <div className={style.accountInfoWithoutStatus}>
                <div className={style.avatar}>
                    <Avatar alt="Remy Sharp" src="../Search/logo512.png" sx={{width: 90, height: 90}}/>
                </div>
                <div className={style.info}>
                    <div className={style.name}>
                        <p>{name}</p>
                    </div>
                    <div className={style.n_reviewed}>
                        <p>Books reviewed: {booksreviewed}</p>
                    </div>
                </div>
            </div>
            <div className={style.status}>
                <p>Status: {status}</p>
            </div>
            <div className={style.chPassBtn}>
                <button>Change password</button>
            </div>
        </div>

    );
}

export default AccountInfo;