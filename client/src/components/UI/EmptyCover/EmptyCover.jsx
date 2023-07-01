import React from 'react';
import style from './EmptyCover.module.css'

function EmptyCover({name, size}) { // size = {"S", "M", "L"}, for small, medium and large images correspondingly
    console.log(size);
    const imageSizes = {"S": [75, 60], "M": [160, 130], "L": [475, 450]}
    const fontSize = {"S": "6.2px", "M": "14px", "L": "39px"}
    const [h, w] = imageSizes[size];
    return (
        <div style={{
            backgroundImage: 'url(/emptyCover' + size + '.png)',
            height: h,
            width: w,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: fontSize[size]
        }}>
            <p className={style.p}>{name}</p>
        </div>
    );
}

export default EmptyCover;