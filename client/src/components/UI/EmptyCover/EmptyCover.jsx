import React from 'react';
import style from './EmptyCover.module.css'
import image from './emptyCover.png'
function EmptyCover({name}) {
    return (
        <div style={{ backgroundImage: 'url(' + image + ')', height: 160, width: 130, display: "flex"}}>
            <p className={style.p}>{name}</p>
        </div>
    );
}

export default EmptyCover;