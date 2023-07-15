import React from 'react';
import style from './MyModal.module.css'
import MyButton from "../Button/MyButton";

function MyModal({children, visible, setVisible, ref, needCloseBtn = true}) {
    const rootCl = [style.myModal]
    if (visible) {
        rootCl.push(style.active);
    }
    return (
        <div ref={ref} className={rootCl.join(' ')} onClick={() => setVisible(false)}>
            <div className={style.myModalContent} onClick={(e) => e.stopPropagation()}>
                {needCloseBtn &&
                    <button className={style.closeBtn} onClick={() => setVisible(false)}>
                        <img src='/close.png'/>
                    </button>
                }
                {children}

            </div>
        </div>
    );
}

export default MyModal;