import React, {useContext} from "react";
import MyInput from "../components/UI/Input/MyInput";
import Navbar from "../components/UI/Navbar/Navbar";
import {BackAddr} from "../context";


const Welcome = () => {
    const addr = useContext(BackAddr);
    const v = (async () => {
        const url = `${addr}/ping`;
        let response = await fetch(url);
        let resp = await response.json();
    })

    v().then(() => console.log('done'))


    return (
        <div>
            <Navbar/>
            <h1>Welcome! Please rate at least 5 books</h1>
            <MyInput placeholder="Enter book titles to rate"></MyInput>
        </div>
    )
}

export default Welcome;