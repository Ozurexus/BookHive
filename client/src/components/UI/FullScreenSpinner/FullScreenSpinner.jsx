import LoadingSpinner from "../LoadingSpinner/Spinner";
import React from "react";

export const FullScreenSpinner = (props) => {
    /*
    * Компонент для каких переходов - например токен закончился и нужно заново логиниться
    * */

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms * 1000));
    }

    if (props.sleep) {
        sleep(props.sleep).then(() => console.log('done'));
    }
    return (
        <div style={{paddingTop: "300px"}}>
            <LoadingSpinner size="150px"/>
        </div>
    )
}
