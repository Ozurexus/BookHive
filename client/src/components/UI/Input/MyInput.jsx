import React from "react";
import style from './MyInput.module.css';

const MyInput = React.forwardRef((props, ref) => {
    return (
        <input ref={ref}
               className={style.myInput}
               {...props}
               style={props.style}
        />
    );
});

export default MyInput;