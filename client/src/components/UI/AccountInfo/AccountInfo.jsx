import React, {useContext, useMemo, useState} from 'react';
import {Avatar} from "@mui/material";
import style from "../../../styles/AccountInfo.module.css";
import {AuthContext, UserContext} from "../../../context";
import MyModal from "../MyModal/MyModal";
import PassChangeForm from "../PassChangeForm/PassChangeForm";
import LoadingSpinner from "../LoadingSpinner/Spinner";
import {deleteAccount} from "../../../utils/backendAPI";
import MyButton from "../Button/MyButton";


function AccountInfo(props) {
    const {books, userLogin, status, isFetchingUserInfo} = useContext(UserContext);
    const {setIsAuth, setAccessToken, setUserId, setNumReviewedBooks, accessToken} = useContext(AuthContext);
    const [passVisible, setPassVisible] = useState(false);
    const [deleteAccountVisible, setDeleteAccountVisible] = useState(false);
    console.log("AccountInfo render")
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
                        <p>Books reviewed:&nbsp;
                            {isFetchingUserInfo
                                ? <div className={style.statusSpinner}>
                                    <LoadingSpinner size="0.5px"/>
                                </div>
                                : books.length
                            }
                        </p>
                    </div>
                </div>
            </div>
            <div className={style.status}>
                <p>Status:&nbsp;
                    {isFetchingUserInfo
                        ? <div className={style.statusSpinner}>
                            <LoadingSpinner size="10px"/>
                        </div>
                        : status
                    }
                </p>

            </div>
            <div className={style.chPassBtnDiv}>
                <button className={style.chPassBtn} onClick={() => setPassVisible(true)}>Change password</button>
                {passVisible &&
                    <MyModal visible={passVisible} setVisible={() => setPassVisible(false)}>
                        <PassChangeForm setVisible={(val) => setPassVisible(val)}/>
                        <br/>
                    </MyModal>
                }
                <button className={style.deleteAccountBtn} onClick={() => {
                    setDeleteAccountVisible(true);
                }}>Delete account
                </button>
                {deleteAccountVisible &&
                    <MyModal needCloseBtn={false} visible={deleteAccountVisible}
                             setVisible={() => setDeleteAccountVisible(false)}>
                        <p>Are you sure that you want to delete account?</p>
                        <div style={{display:"flex", justifyContent:"space-between", padding:"20px"}}>
                            <MyButton onClick={() => {
                                deleteAccount(accessToken).then(r => {
                                    setIsAuth(false);
                                    setAccessToken('');
                                    setUserId('');
                                    setNumReviewedBooks(0);
                                    localStorage.removeItem('auth');
                                    localStorage.removeItem('userId');
                                    localStorage.removeItem('accessToken');
                                    localStorage.removeItem('userLogin');
                                })
                            }}>OK
                            </MyButton>
                            <MyButton onClick={() => setDeleteAccountVisible(false)}>Cancel</MyButton>
                        </div>

                    </MyModal>
                }
            </div>
        </div>
    );
}

export default AccountInfo;