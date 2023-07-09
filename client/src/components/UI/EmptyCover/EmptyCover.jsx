import React from 'react';
import style from './EmptyCover.module.css'

function EmptyCover({name, size}) { // size = {"S", "M", "L"}, for small, medium and large images correspondingly
    const imageSizes = {"S": [75, 60], "M": [190, 150], "L": [520, 380]}
    const fontSize = {"S": "7px", "M": "17px", "L": "35px"}
    const [h, w] = imageSizes[size];
    return (
        <div style={{
            backgroundImage: "url("+'/emptyCover' + size + '.png'+")",
            backgroundSize: "100% 100%",
            height: h,
            width: w,
            display: "flex",
            justifyContent: "center",
            textAlign: 'center',
            alignItems: "center",
            fontSize: fontSize[size],

        }}>
            <p className={style.p}>{name}</p>

        </div>

    );
}

export default EmptyCover;