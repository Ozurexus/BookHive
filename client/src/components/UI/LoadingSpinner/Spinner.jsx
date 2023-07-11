import React from "react";
import style from './Spinner.module.css';


export default function LoadingSpinner(props) {
  return (
    <div className={style.loader} style={{width: props.size, height: props.size}}></div>
  );
}