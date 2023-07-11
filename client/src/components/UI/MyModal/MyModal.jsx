import React from 'react';
import style from './MyModal.module.css'
import MyButton from "../Button/MyButton";
function MyModal({ children, visible, setVisible, ref }) {
    const rootCl = [style.myModal]
    if(visible) {
        rootCl.push(style.active);
    }
    return (
        <div ref={ref} className={rootCl.join(' ')} onClick={() => setVisible(false)}>
            <div className={style.myModalContent} onClick={(e) => e.stopPropagation()}>
                {children}
                <MyButton onClick={() => setVisible(false)}>Close</MyButton>
            </div>
        </div>
    );
}

export default MyModal;